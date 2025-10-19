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
	systemSectionMap map[uuid.UUID]sectionMap

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

// GetSystemProfileSectionLocks returns the list of locked system profile sections. Any sections not included should be considered as unlocked.
func GetSystemProfileSectionLocks(cedarSystemID uuid.UUID) ([]*models.SystemProfileSectionLockStatus, error) {
	sectionsLockedMap, found := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !found {
		return nil, nil
	}

	var sectionsLocked []*models.SystemProfileSectionLockStatus
	for key := range sectionsLockedMap {
		status := sectionsLockedMap[key]
		sectionsLocked = append(sectionsLocked, &status)
	}

	return sectionsLocked, nil
}

// SubscribeSystemProfileSectionLockChanges creates a Subscriber and registers it for the pubsubevents.SystemProfileSectionLocksChanged event
func SubscribeSystemProfileSectionLockChanges(ps pubsub.PubSub, cedarSystemID uuid.UUID, subscriber *subscribers.SystemProfileLockChangedSubscriber, onDisconnect <-chan struct{}) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	ps.Subscribe(cedarSystemID, pubsubevents.SystemProfileSectionLocksChanged, subscriber, onDisconnect)
	return subscriber.GetChannel(), nil
}

// LockSystemProfileSection will lock the provided system profile section on the provided system
func LockSystemProfileSection(ps pubsub.PubSub, cedarSystemID uuid.UUID, section models.SystemProfileLockableSection, principal authentication.Principal) (bool, error) {

	systemLocks, foundSystemLocks := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !foundSystemLocks {
		systemProfileSessionLocks.systemSections[cedarSystemID] = make(sectionMap)
		systemLocks = systemProfileSessionLocks.systemSections[cedarSystemID]
	}

	lockStatus, sectionWasLocked := systemLocks[section]
	if sectionWasLocked && lockStatus.LockedByUserAccount.ID != principal.Account().ID {
		return false, fmt.Errorf("failed to lock section [%v], already locked by [%v]", section, lockStatus.LockedByUserAccount.ID)
	}

	account := principal.Account()
	if account == nil {
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

	systemProfileSessionLocks.Lock()
	systemProfileSessionLocks.systemSections[cedarSystemID][section] = status
	systemProfileSessionLocks.Unlock()

	if !sectionWasLocked {
		ps.Publish(cedarSystemID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
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
func UnlockSystemProfileSection(ps pubsub.PubSub, cedarSystemID uuid.UUID, section models.SystemProfileLockableSection, userID uuid.UUID, actionType models.LockActionType) (bool, error) {
	if !isSectionLocked(cedarSystemID, section) {
		return false, nil
	}

	status := systemProfileSessionLocks.systemSections[cedarSystemID][section]
	if !isUserAuthorizedToEditLock(status, userID) {
		return false, fmt.Errorf("failed to unlock section [%v], user [%v] not authorized to unlock section locked by user [%v]", section, userID, status.LockedByUserAccount.ID)
	}

	deleteSystemProfileLockSection(ps, cedarSystemID, section, status, actionType)
	return true, nil
}

func deleteSystemProfileLockSection(ps pubsub.PubSub, cedarSystemID uuid.UUID, section models.SystemProfileLockableSection, status models.SystemProfileSectionLockStatus, actionType models.LockActionType) {
	systemProfileSessionLocks.Lock()
	delete(systemProfileSessionLocks.systemSections[cedarSystemID], section)
	systemProfileSessionLocks.Unlock()

	ps.Publish(cedarSystemID, pubsubevents.SystemProfileSectionLocksChanged, models.SystemProfileSectionLockStatusChanged{
		ChangeType: models.LockChangeTypeRemoved,
		LockStatus: &status,
		ActionType: actionType,
	})
}

func isUserAuthorizedToEditLock(status models.SystemProfileSectionLockStatus, userID uuid.UUID) bool {
	return userID == status.LockedByUserAccount.ID
}

// UnlockAllSystemProfileSections will unlock all system profile sections on the provided system
func UnlockAllSystemProfileSections(ps pubsub.PubSub, cedarSystemID uuid.UUID) ([]*models.SystemProfileSectionLockStatus, error) {
	var deletedSections []*models.SystemProfileSectionLockStatus
	for section, status := range systemProfileSessionLocks.systemSections[cedarSystemID] {
		dupe := status
		deletedSections = append(deletedSections, &dupe)
		deleteSystemProfileLockSection(ps, cedarSystemID, section, status, models.LockActionTypeAdmin)
	}

	delete(systemProfileSessionLocks.systemSections, cedarSystemID)
	return deletedSections, nil
}

func isSectionLocked(cedarSystemID uuid.UUID, section models.SystemProfileLockableSection) bool {
	session, found := systemProfileSessionLocks.systemSections[cedarSystemID]
	if !found {
		return false
	}

	_, found = session[section]
	return found
}

// internalSubscribeToSystemProfileSectionLockChanges creates a new
// subscriber and subscribes it to the pubsubevents.SystemProfileSectionLocksChanged
// event. It returns the subscriber's channel and any error that occurred.
func internalSubscribeToSystemProfileSectionLockChanges(
	ps pubsub.PubSub,
	cedarSystemID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
	onUnsubscribedCallback subscribers.OnSystemProfileLockChangedUnsubscribedCallback,
) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	subscriber := subscribers.NewSystemProfileLockChangedSubscriber(principal)

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
	cedarSystemID uuid.UUID,
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
	cedarSystemID uuid.UUID,
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
	cedarSystemID uuid.UUID,
) {
	ownedSectionLocks := getOwnedSections(systemProfileSessionLocks.systemSections[cedarSystemID], subscriber)

	for _, section := range ownedSectionLocks {
		_, err := UnlockSystemProfileSection(ps, cedarSystemID, section, subscriber.GetPrincipal().Account().ID, models.LockActionTypeNormal)

		if err != nil {
			fmt.Printf("Uncapturable error on websocket disconnect: %v\n", err.Error()) //TODO: can we pass a reference to the logger to the pubsub?
		}
	}
}
