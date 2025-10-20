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
	sectionMap       map[models.SystemProfileLockableSection]models.SystemProfileSectionLockStatus
	systemSectionMap map[string]sectionMap

	sessionLockController struct {
		systemSections systemSectionMap
		sync.Mutex
	}
)

var (
	systemProfileSessionLocks sessionLockController
)

func init() {
	systemProfileSessionLocks = sessionLockController{systemSections: make(systemSectionMap)}
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
	sectionsLockedMap, found := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return nil, nil
	}

	var sectionsLocked []*models.SystemProfileSectionLockStatus
	for key := range sectionsLockedMap {
		status := sectionsLockedMap[key]
		sectionsLocked = append(sectionsLocked, &status)
	}
	systemProfileSessionLocks.Unlock()

	return sectionsLocked, nil
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

	systemLocks, foundSystemLocks := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !foundSystemLocks {
		systemProfileSessionLocks.systemSections[cedarSystemID] = make(sectionMap)
		systemLocks = systemProfileSessionLocks.systemSections[cedarSystemID]
	}

	lockStatus, sectionWasLocked := systemLocks[section]
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

	status := models.SystemProfileSectionLockStatus{
		CedarSystemID:       cedarSystemID,
		Section:             section,
		LockedByUserAccount: account,
		IsAdmin:             isAdmin,
	}

	systemProfileSessionLocks.systemSections[cedarSystemID][section] = status
	systemProfileSessionLocks.Unlock()

	if !sectionWasLocked {
		sessionID := cedarSystemIDToSessionID(cedarSystemID)
		ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
			ChangeType: models.LockChangeTypeAdded,
			LockStatus: &status,
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

	session, found := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return false, nil
	}

	status, found := session[section]
	if !found {
		systemProfileSessionLocks.Unlock()
		return false, nil
	}

	if !isUserAuthorizedToEditLock(status, userID) {
		systemProfileSessionLocks.Unlock()
		return false, fmt.Errorf("failed to unlock section [%v], user [%v] not authorized to unlock section locked by user [%v]", section, userID, status.LockedByUserAccount.ID)
	}

	delete(systemProfileSessionLocks.systemSections[cedarSystemID], section)
	systemProfileSessionLocks.Unlock()

	// Publish outside the lock to avoid blocking other operations
	sessionID := cedarSystemIDToSessionID(cedarSystemID)
	ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
		ChangeType: models.LockChangeTypeRemoved,
		LockStatus: &status,
		ActionType: actionType,
	})

	return true, nil
}

func isUserAuthorizedToEditLock(status models.SystemProfileSectionLockStatus, userID uuid.UUID) bool {
	return userID == status.LockedByUserAccount.ID
}

// UnlockAllSystemProfileSections will unlock all system profile sections on the provided system
func UnlockAllSystemProfileSections(ps pubsub.PubSub, cedarSystemID string) ([]*models.SystemProfileSectionLockStatus, error) {
	systemProfileSessionLocks.Lock()

	systemSections, found := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return nil, nil
	}

	// Copy sections to unlock while holding the lock
	var sectionsToUnlock []struct {
		section models.SystemProfileLockableSection
		status  models.SystemProfileSectionLockStatus
	}

	for section, status := range systemSections {
		sectionsToUnlock = append(sectionsToUnlock, struct {
			section models.SystemProfileLockableSection
			status  models.SystemProfileSectionLockStatus
		}{section: section, status: status})
	}

	// Delete from map while holding lock
	delete(systemProfileSessionLocks.systemSections, cedarSystemID)
	systemProfileSessionLocks.Unlock()

	// Publish events outside the lock
	sessionID := cedarSystemIDToSessionID(cedarSystemID)
	var deletedSections []*models.SystemProfileSectionLockStatus
	for _, item := range sectionsToUnlock {
		deletedSections = append(deletedSections, &item.status)
		ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
			ChangeType: models.LockChangeTypeRemoved,
			LockStatus: &item.status,
			ActionType: models.LockActionTypeAdmin,
		})
	}

	return deletedSections, nil
}

// internalSubscribeToSystemProfileSectionLockChanges creates a new
// subscriber and subscribes it to the pubsubevents.SystemProfileSectionLocksChanged
// event. It returns the subscriber's channel and any error that occurred.
func internalSubscribeToSystemProfileSectionLockChanges(
	ps pubsub.PubSub,
	cedarSystemID string,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
	onUnsubscribedCallback subscribers.OnSystemProfileLockChangedUnsubscribedCallback,
) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	subscriber := subscribers.NewSystemProfileLockChangedSubscriber(principal, cedarSystemID)

	subscriber.SetOnUnsubscribedCallback(onUnsubscribedCallback)

	return SubscribeSystemProfileSectionLockChanges(
		ps,
		cedarSystemID,
		subscriber,
		onDisconnect,
	)
}

// getOwnedSections returns a list of system profile sections owned by a specific principal
func getOwnedSections(systemSectionLocks sectionMap, subscriber pubsub.Subscriber) []models.SystemProfileLockableSection {
	var ownedSections []models.SystemProfileLockableSection

	for section, status := range systemSectionLocks {
		if status.LockedByUserAccount.ID == subscriber.GetPrincipal().Account().ID {
			ownedSections = append(ownedSections, section)
		}
	}

	return ownedSections
}

// SubscribeSystemProfileSectionLockChangesWithCallback is a convenience relay method to subscribe to lock changes
func SubscribeSystemProfileSectionLockChangesWithCallback(
	ps pubsub.PubSub,
	cedarSystemID string,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	return internalSubscribeToSystemProfileSectionLockChanges(
		ps,
		cedarSystemID,
		principal,
		onDisconnect,
		nil,
	)
}

// OnLockSystemProfileSectionContext maintains a webhook monitoring changes to system
// profile sections. Once that webhook dies it will auto-unlock any section locked
// by that user.
func OnLockSystemProfileSectionContext(
	ps pubsub.PubSub,
	cedarSystemID string,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	return internalSubscribeToSystemProfileSectionLockChanges(
		ps,
		cedarSystemID,
		principal,
		onDisconnect,
		onLockSystemProfileSectionUnsubscribeComplete,
	)
}

func onLockSystemProfileSectionUnsubscribeComplete(
	ps pubsub.PubSub,
	subscriber pubsub.Subscriber,
	cedarSystemID string,
) {
	systemProfileSessionLocks.Lock()
	systemSections, found := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return
	}

	ownedSectionLocks := getOwnedSections(systemSections, subscriber)
	systemProfileSessionLocks.Unlock()

	for _, section := range ownedSectionLocks {
		_, err := UnlockSystemProfileSection(ps, cedarSystemID, section, subscriber.GetPrincipal().Account().ID, models.LockActionTypeNormal)

		if err != nil {
			fmt.Printf("Uncapturable error on websocket disconnect: %v\n", err.Error()) //TODO: can we pass a reference to the logger to the pubsub?
		}
	}
}
