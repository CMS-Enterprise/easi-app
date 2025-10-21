package resolvers

import (
	"fmt"
	"sync"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/graph/model/subscribers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/models/pubsubevents"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

type (
	// sectionLockStatusMap maps each lockable section to its current lock status for a single system profile
	sectionLockStatusMap map[models.SystemProfileLockableSection]models.SystemProfileSectionLockStatus
	// systemLockStatusMap maps system IDs to their corresponding section lock status maps
	systemLockStatusMap map[string]sectionLockStatusMap

	sessionLockController struct {
		systemLockStatuses systemLockStatusMap
		sync.Mutex
	}
)

var (
	systemProfileSessionLocks sessionLockController
)

func init() {
	systemProfileSessionLocks = sessionLockController{systemLockStatuses: make(systemLockStatusMap)}
}

// cedarSystemIDToSessionID converts a CEDAR system ID string to a UUID for pubsub sessions.
// The same cedarSystemID always maps to the same sessionID for consistency.
// TODO: Remove this conversion if/when cedarSystemId is migrated from string to UUID in the schema.
func cedarSystemIDToSessionID(cedarSystemID string) uuid.UUID {
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(cedarSystemID))
}

// GetSystemProfileSectionLocks returns the list of locked system profile sections. Any sections not included should be considered as unlocked.
func GetSystemProfileSectionLocks(cedarSystemID string) ([]*models.SystemProfileSectionLockStatus, error) {
	systemProfileSessionLocks.Lock()

	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return nil, nil
	}

	var lockStatuses []*models.SystemProfileSectionLockStatus
	for section := range sectionLocks {
		lockStatus := sectionLocks[section]
		lockStatuses = append(lockStatuses, &lockStatus)
	}
	systemProfileSessionLocks.Unlock()

	return lockStatuses, nil
}

// SubscribeSystemProfileSectionLockChanges creates a Subscriber and registers it for the pubsubevents.SystemProfileSectionLocksChanged event
func SubscribeSystemProfileSectionLockChanges(ps pubsub.PubSub, cedarSystemID string, subscriber *subscribers.SystemProfileLockChangedSubscriber, onDisconnect <-chan struct{}) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	sessionID := cedarSystemIDToSessionID(cedarSystemID)
	ps.Subscribe(sessionID, pubsubevents.SystemProfileSectionLocksChanged, subscriber, onDisconnect)
	return subscriber.GetChannel(), nil
}

// LockSystemProfileSection will lock the provided system profile section on the provided system
func LockSystemProfileSection(ps pubsub.PubSub, cedarSystemID string, section models.SystemProfileLockableSection, principal authentication.Principal) (bool, error) {
	systemProfileSessionLocks.Lock()

	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.systemLockStatuses[cedarSystemID] = make(sectionLockStatusMap)
		sectionLocks = systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	}

	lockStatus, sectionWasLocked := sectionLocks[section]
	if sectionWasLocked && lockStatus.LockedByUserAccount.ID != principal.Account().ID {
		systemProfileSessionLocks.Unlock()
		return false, fmt.Errorf("failed to lock section [%v], already locked by [%v]", section, lockStatus.LockedByUserAccount.ID)
	}

	account := principal.Account()
	if account == nil {
		systemProfileSessionLocks.Unlock()
		return false, fmt.Errorf("failed to lock section [%v], unable to retrieve user account", section)
	}

	// Determine if this is an admin action - user has GRT or TRB admin privileges
	isAdmin := principal.AllowGRT() || principal.AllowTRBAdmin()

	newLockStatus := models.SystemProfileSectionLockStatus{
		CedarSystemID:       cedarSystemID,
		Section:             section,
		LockedByUserAccount: account,
		IsAdmin:             isAdmin,
	}

	systemProfileSessionLocks.systemLockStatuses[cedarSystemID][section] = newLockStatus
	systemProfileSessionLocks.Unlock()

	if !sectionWasLocked {
		sessionID := cedarSystemIDToSessionID(cedarSystemID)
		ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
			ChangeType: models.LockChangeTypeAdded,
			LockStatus: &newLockStatus,
			ActionType: models.LockActionTypeNormal,
		})
	}

	return true, nil
}

// UnlockSystemProfileSection will unlock the provided system profile section on the provided system
//
// This method will fail if the provided principal is not the person who locked the system profile section or if the section is not locked.
func UnlockSystemProfileSection(ps pubsub.PubSub, cedarSystemID string, section models.SystemProfileLockableSection, userID uuid.UUID, actionType models.LockActionType) (bool, error) {
	systemProfileSessionLocks.Lock()

	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return false, nil
	}

	lockStatus, sectionFound := sectionLocks[section]
	if !sectionFound {
		systemProfileSessionLocks.Unlock()
		return false, nil
	}

	if !isUserAuthorizedToEditLock(lockStatus, userID) {
		systemProfileSessionLocks.Unlock()
		return false, fmt.Errorf("failed to unlock section [%v], user [%v] not authorized to unlock section locked by user [%v]", section, userID, lockStatus.LockedByUserAccount.ID)
	}

	delete(systemProfileSessionLocks.systemLockStatuses[cedarSystemID], section)

	// Clean up empty system map
	if len(systemProfileSessionLocks.systemLockStatuses[cedarSystemID]) == 0 {
		delete(systemProfileSessionLocks.systemLockStatuses, cedarSystemID)
	}

	systemProfileSessionLocks.Unlock()

	// Publish outside the lock to avoid blocking other operations
	sessionID := cedarSystemIDToSessionID(cedarSystemID)
	ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
		ChangeType: models.LockChangeTypeRemoved,
		LockStatus: &lockStatus,
		ActionType: actionType,
	})

	return true, nil
}

// isUserAuthorizedToEditLock checks if a user is authorized to unlock a section.
// Users can only unlock sections they personally locked.
func isUserAuthorizedToEditLock(lockStatus models.SystemProfileSectionLockStatus, userID uuid.UUID) bool {
	return userID == lockStatus.LockedByUserAccount.ID
}

// UnlockAllSystemProfileSections is an admin function that unlocks all sections for a system.
// Bypasses ownership checks - can unlock sections owned by any user.
// Publishes REMOVED events with ADMIN action type for each unlocked section.
func UnlockAllSystemProfileSections(ps pubsub.PubSub, cedarSystemID string) ([]*models.SystemProfileSectionLockStatus, error) {
	systemProfileSessionLocks.Lock()

	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return nil, nil
	}

	// Copy sections to unlock while holding the lock
	var sectionsToUnlock []struct {
		section    models.SystemProfileLockableSection
		lockStatus models.SystemProfileSectionLockStatus
	}

	for section, lockStatus := range sectionLocks {
		sectionsToUnlock = append(sectionsToUnlock, struct {
			section    models.SystemProfileLockableSection
			lockStatus models.SystemProfileSectionLockStatus
		}{section: section, lockStatus: lockStatus})
	}

	// Delete from map while holding lock
	delete(systemProfileSessionLocks.systemLockStatuses, cedarSystemID)
	systemProfileSessionLocks.Unlock()

	// Publish events outside the lock
	sessionID := cedarSystemIDToSessionID(cedarSystemID)
	var unlockedSections []*models.SystemProfileSectionLockStatus
	for _, item := range sectionsToUnlock {
		unlockedSections = append(unlockedSections, &item.lockStatus)
		ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
			ChangeType: models.LockChangeTypeRemoved,
			LockStatus: &item.lockStatus,
			ActionType: models.LockActionTypeAdmin,
		})
	}

	return unlockedSections, nil
}

// getOwnedSections returns a list of system profile sections owned by a specific principal
func getOwnedSections(sectionLocks sectionLockStatusMap, subscriber pubsub.Subscriber) []models.SystemProfileLockableSection {
	var ownedSections []models.SystemProfileLockableSection

	for section, lockStatus := range sectionLocks {
		if lockStatus.LockedByUserAccount.ID == subscriber.GetPrincipal().Account().ID {
			ownedSections = append(ownedSections, section)
		}
	}

	return ownedSections
}

// OnSystemProfileSectionLockStatusChanged subscribes to lock status change events for a system profile.
// Automatically unlocks all sections owned by the user when the websocket connection closes.
func OnSystemProfileSectionLockStatusChanged(
	ps pubsub.PubSub,
	cedarSystemID string,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	subscriber := subscribers.NewSystemProfileLockChangedSubscriber(principal, cedarSystemID)
	subscriber.SetOnUnsubscribedCallback(onLockSystemProfileSectionUnsubscribeComplete)

	return SubscribeSystemProfileSectionLockChanges(
		ps,
		cedarSystemID,
		subscriber,
		onDisconnect,
	)
}

// onLockSystemProfileSectionUnsubscribeComplete is a callback invoked when the lock status subscription
// disconnects. It automatically unlocks all sections owned by the disconnected user to prevent
// abandoned locks.
func onLockSystemProfileSectionUnsubscribeComplete(
	ps pubsub.PubSub,
	subscriber *subscribers.SystemProfileLockChangedSubscriber,
) {
	cedarSystemID := subscriber.CedarSystemID
	systemProfileSessionLocks.Lock()
	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return
	}

	ownedSections := getOwnedSections(sectionLocks, subscriber)
	systemProfileSessionLocks.Unlock()

	for _, section := range ownedSections {
		_, err := UnlockSystemProfileSection(ps, cedarSystemID, section, subscriber.GetPrincipal().Account().ID, models.LockActionTypeNormal)

		if err != nil {
			fmt.Printf("Uncapturable error on websocket disconnect: %v\n", err.Error()) //TODO: can we pass a reference to the logger to the pubsub?
		}
	}
}
