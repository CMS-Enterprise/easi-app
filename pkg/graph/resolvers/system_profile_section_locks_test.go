package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

// Helper to create a test principal
func createTestPrincipal(euaID string, allowGRT bool) authentication.Principal {
	return &authentication.EUAPrincipal{
		EUAID:      euaID,
		JobCodeGRT: allowGRT,
		UserAccount: &authentication.UserAccount{
			ID:         uuid.New(),
			Username:   euaID,
			CommonName: euaID + " Test",
			Email:      euaID + "@test.local",
		},
	}
}

func TestSystemProfileSectionLock(t *testing.T) {
	// Reset global state before test
	systemProfileSessionLocks = sessionLockController{systemLockStatuses: make(systemLockStatusMap)}

	cedarSystemID := uuid.MustParse("61469178-a474-445d-a6ef-db84fe425e02")
	section := models.SystemProfileLockableSectionBusinessInformation
	ps := pubsub.NewServicePubSub()
	principal := createTestPrincipal("ABCD", false)

	// Initial state - no locks
	locks, err := GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	assert.Empty(t, locks)

	// Lock a section
	locked, err := LockSystemProfileSection(ps, cedarSystemID, section, principal)
	require.NoError(t, err)
	assert.True(t, locked)

	// Verify section is locked
	locks, err = GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	require.Len(t, locks, 1)
	assert.Equal(t, cedarSystemID, locks[0].CedarSystemID)
	assert.Equal(t, section, locks[0].Section)
	assert.Equal(t, principal.Account().ID, locks[0].LockedByUserAccount.ID)

	// Unlock the section
	userID := principal.Account().ID
	unlocked, err := UnlockSystemProfileSection(ps, cedarSystemID, section, userID)
	require.NoError(t, err)
	assert.True(t, unlocked)

	// Verify section is unlocked
	locks, err = GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	assert.Empty(t, locks)
}

func TestSystemProfileSectionLockConflict(t *testing.T) {
	// Reset global state before test
	systemProfileSessionLocks = sessionLockController{systemLockStatuses: make(systemLockStatusMap)}

	cedarSystemID := uuid.MustParse("e321c11a-a720-490a-a51d-70a00256efcf")
	section := models.SystemProfileLockableSectionData
	ps := pubsub.NewServicePubSub()

	userA := createTestPrincipal("ABCD", false)
	userB := createTestPrincipal("USR1", false)

	// User A locks the section
	locked, err := LockSystemProfileSection(ps, cedarSystemID, section, userA)
	require.NoError(t, err)
	assert.True(t, locked)

	// User B tries to lock the same section - should fail
	locked, err = LockSystemProfileSection(ps, cedarSystemID, section, userB)
	require.Error(t, err)
	assert.False(t, locked)
	assert.Contains(t, err.Error(), "already locked by")

	// Verify only User A's lock exists
	locks, err := GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	require.Len(t, locks, 1)
	assert.Equal(t, userA.Account().ID, locks[0].LockedByUserAccount.ID)

	// User A unlocks
	unlocked, err := UnlockSystemProfileSection(ps, cedarSystemID, section, userA.Account().ID)
	require.NoError(t, err)
	assert.True(t, unlocked)

	// Now User B can lock the section
	locked, err = LockSystemProfileSection(ps, cedarSystemID, section, userB)
	require.NoError(t, err)
	assert.True(t, locked)

	// Verify User B's lock exists
	locks, err = GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	require.Len(t, locks, 1)
	assert.Equal(t, userB.Account().ID, locks[0].LockedByUserAccount.ID)
}

func TestUnlockAllSystemProfileSections(t *testing.T) {
	// Reset global state before test
	systemProfileSessionLocks = sessionLockController{systemLockStatuses: make(systemLockStatusMap)}

	cedarSystemID := uuid.MustParse("b105ddf3-c758-4f13-a520-976ffb1be680")
	ps := pubsub.NewServicePubSub()
	principal := createTestPrincipal("ABCD", false)

	// Lock multiple sections
	section1 := models.SystemProfileLockableSectionBusinessInformation
	section2 := models.SystemProfileLockableSectionData
	section3 := models.SystemProfileLockableSectionTeam

	locked1, err := LockSystemProfileSection(ps, cedarSystemID, section1, principal)
	require.NoError(t, err)
	assert.True(t, locked1)

	locked2, err := LockSystemProfileSection(ps, cedarSystemID, section2, principal)
	require.NoError(t, err)
	assert.True(t, locked2)

	locked3, err := LockSystemProfileSection(ps, cedarSystemID, section3, principal)
	require.NoError(t, err)
	assert.True(t, locked3)

	// Verify all sections are locked
	locks, err := GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	assert.Len(t, locks, 3)

	// Unlock all sections
	deletedSections, err := UnlockAllSystemProfileSections(ps, cedarSystemID)
	require.NoError(t, err)
	assert.Len(t, deletedSections, 3)

	// Verify all sections match what was deleted
	deletedSectionTypes := make(map[models.SystemProfileLockableSection]bool)
	for _, deleted := range deletedSections {
		deletedSectionTypes[deleted.Section] = true
	}
	assert.True(t, deletedSectionTypes[section1])
	assert.True(t, deletedSectionTypes[section2])
	assert.True(t, deletedSectionTypes[section3])

	// Verify no locks remain
	locks, err = GetSystemProfileSectionLocks(cedarSystemID)
	require.NoError(t, err)
	assert.Empty(t, locks)
}
