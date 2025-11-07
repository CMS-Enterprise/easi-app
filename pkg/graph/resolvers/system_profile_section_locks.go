package resolvers

import (
	"context"
	"fmt"
	"sync"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/graph/model/subscribers"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
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

	// sectionLockEntry holds a lockable section and its corresponding lock status
	// extracted from the section lock status map
	sectionLockEntry struct {
		section    models.SystemProfileLockableSection
		lockStatus models.SystemProfileSectionLockStatus
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
		ls := lockStatus
		lockStatuses = append(lockStatuses, &ls)
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

	account := principal.Account()
	if account == nil {
		systemProfileSessionLocks.Unlock()
		return false, fmt.Errorf("failed to lock section [%v], unable to retrieve user account", section)
	}

	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.systemLockStatuses[cedarSystemID] = make(sectionLockStatusMap)
		sectionLocks = systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	}

	lockStatus, sectionWasLocked := sectionLocks[section]
	if sectionWasLocked && lockStatus.LockedByUserAccount.ID != account.ID {
		systemProfileSessionLocks.Unlock()
		return false, fmt.Errorf("failed to lock section [%v], already locked by [%v]", section, lockStatus.LockedByUserAccount.ID)
	}

	newLockStatus := models.SystemProfileSectionLockStatus{
		CedarSystemID:       cedarSystemID,
		Section:             section,
		LockedByUserAccount: account,
	}

	systemProfileSessionLocks.systemLockStatuses[cedarSystemID][section] = newLockStatus
	systemProfileSessionLocks.Unlock()

	if !sectionWasLocked {
		sessionID := cedarSystemIDToSessionID(cedarSystemID)
		ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
			ChangeType: models.LockChangeTypeAdded,
			LockStatus: &newLockStatus,
		})
	}

	return true, nil
}

// UnlockSystemProfileSection will unlock the provided system profile section on the provided system
//
// This method will fail if the provided principal is not the person who locked the system profile section or if the section is not locked.
func UnlockSystemProfileSection(ps pubsub.PubSub, cedarSystemID string, section models.SystemProfileLockableSection, userID uuid.UUID) (bool, error) {
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
	})

	return true, nil
}

// isUserAuthorizedToEditLock checks if a user is authorized to unlock a section.
// Users can only unlock sections they personally locked.
func isUserAuthorizedToEditLock(lockStatus models.SystemProfileSectionLockStatus, userID uuid.UUID) bool {
	return userID == lockStatus.LockedByUserAccount.ID
}

// UnlockAllSystemProfileSections unlocks all sections for a system.
// Bypasses ownership checks - can unlock sections owned by any user.
// Publishes REMOVED events for each unlocked section.
func UnlockAllSystemProfileSections(ps pubsub.PubSub, cedarSystemID string) ([]*models.SystemProfileSectionLockStatus, error) {
	systemProfileSessionLocks.Lock()

	sectionLocks, found := systemProfileSessionLocks.systemLockStatuses[cedarSystemID]
	if !found {
		systemProfileSessionLocks.Unlock()
		return nil, nil
	}

	// Copy sections to unlock while holding the lock
	var sectionsToUnlock []sectionLockEntry

	for section, lockStatus := range sectionLocks {
		sectionsToUnlock = append(sectionsToUnlock, sectionLockEntry{
			section:    section,
			lockStatus: lockStatus,
		})
	}

	// Delete from map while holding lock
	delete(systemProfileSessionLocks.systemLockStatuses, cedarSystemID)
	systemProfileSessionLocks.Unlock()

	// Publish events outside the lock
	sessionID := cedarSystemIDToSessionID(cedarSystemID)
	var unlockedSections []*models.SystemProfileSectionLockStatus
	for _, item := range sectionsToUnlock {
		lockStatus := item.lockStatus
		ls := lockStatus
		unlockedSections = append(unlockedSections, &ls)

		ps.Publish(sessionID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
			ChangeType: models.LockChangeTypeRemoved,
			LockStatus: &ls,
		})
	}

	return unlockedSections, nil
}

// getOwnedSections returns a list of system profile sections owned by a specific principal
func getOwnedSections(sectionLocks sectionLockStatusMap, subscriber pubsub.Subscriber) []models.SystemProfileLockableSection {
	var ownedSections []models.SystemProfileLockableSection

	account := subscriber.GetPrincipal().Account()
	if account == nil {
		return ownedSections
	}

	for section, lockStatus := range sectionLocks {
		if lockStatus.LockedByUserAccount.ID == account.ID {
			ownedSections = append(ownedSections, section)
		}
	}

	return ownedSections
}

// OnSystemProfileSectionLockStatusChanged subscribes to lock status change events for a system profile.
// Automatically unlocks all sections owned by the user when the websocket connection closes.
func OnSystemProfileSectionLockStatusChanged(
	ctx context.Context,
	ps pubsub.PubSub,
	cedarSystemID string,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	logger := appcontext.ZLogger(ctx)

	// Add trace ID to logger
	if traceID, ok := appcontext.Trace(ctx); ok {
		logger = logger.With(zap.String("trace_id", traceID.String()))
	}

	// Add app section to identify system profile locking operations
	logger = logger.With(logfields.SystemProfileLockingAppSection)

	subscriber := subscribers.NewSystemProfileLockChangedSubscriber(principal, cedarSystemID, logger)
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

	account := subscriber.GetPrincipal().Account()
	if account == nil {
		subscriber.Logger.Error("Failed to get account from principal during auto-unlock on disconnect",
			zap.String("cedar_system_id", cedarSystemID),
		)
		return
	}

	for _, section := range ownedSections {
		_, err := UnlockSystemProfileSection(ps, cedarSystemID, section, account.ID)

		if err != nil {
			subscriber.Logger.Error("Failed to auto-unlock section on websocket disconnect",
				zap.Error(err),
				zap.String("cedar_system_id", cedarSystemID),
				zap.String("section", string(section)),
				zap.String("user_id", account.ID.String()),
			)
		}
	}
}
