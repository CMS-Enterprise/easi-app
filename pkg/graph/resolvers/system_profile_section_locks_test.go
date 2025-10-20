package resolvers

import (
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

// cleanupSystemProfileLocks clears the global in-memory lock state to prevent test interference
func cleanupSystemProfileLocks(ps pubsub.PubSub, cedarSystemID string) {
	_, _ = UnlockAllSystemProfileSections(ps, cedarSystemID)
}

func (s *ResolverSuite) TestSystemProfileSectionLock() {
	cedarSystemID := "61469178-a474-445d-a6ef-db84fe425e02"
	section := models.SystemProfileLockableSectionBusinessInformation
	ps := pubsub.NewServicePubSub()
	principal := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, "ABCD", false)
	defer cleanupSystemProfileLocks(ps, cedarSystemID)

	s.Run("should lock a section", func() {
		// Initial state - no locks
		locks, err := GetSystemProfileSectionLocks(cedarSystemID)
		s.NoError(err)
		s.Empty(locks)

		// Lock a section
		locked, err := LockSystemProfileSection(ps, cedarSystemID, section, principal)
		s.NoError(err)
		s.True(locked)

		// Verify section is locked
		locks, err = GetSystemProfileSectionLocks(cedarSystemID)
		s.NoError(err)
		s.Len(locks, 1)
		s.Equal(cedarSystemID, locks[0].CedarSystemID)
		s.Equal(section, locks[0].Section)
		s.Equal(principal.Account().ID, locks[0].LockedByUserAccount.ID)
	})

	s.Run("should unlock a section", func() {
		// Unlock the section
		userID := principal.Account().ID
		unlocked, err := UnlockSystemProfileSection(ps, cedarSystemID, section, userID, models.LockActionTypeNormal)
		s.NoError(err)
		s.True(unlocked)

		// Verify section is unlocked
		locks, err := GetSystemProfileSectionLocks(cedarSystemID)
		s.NoError(err)
		s.Empty(locks)
	})
}

func (s *ResolverSuite) TestSystemProfileSectionLockConflict() {
	cedarSystemID := "e321c11a-a720-490a-a51d-70a00256efcf"
	section := models.SystemProfileLockableSectionData
	ps := pubsub.NewServicePubSub()
	defer cleanupSystemProfileLocks(ps, cedarSystemID)

	userA := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, "ABCD", false)
	userB := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, "USR1", false)

	// User A locks the section
	locked, err := LockSystemProfileSection(ps, cedarSystemID, section, userA)
	s.NoError(err)
	s.True(locked)

	// User B tries to lock the same section - should fail
	locked, err = LockSystemProfileSection(ps, cedarSystemID, section, userB)
	s.Error(err)
	s.False(locked)
	s.Contains(err.Error(), "already locked by")

	// Verify only User A's lock exists
	locks, err := GetSystemProfileSectionLocks(cedarSystemID)
	s.NoError(err)
	s.Len(locks, 1)
	s.Equal(userA.Account().ID, locks[0].LockedByUserAccount.ID)

	// User A unlocks
	unlocked, err := UnlockSystemProfileSection(ps, cedarSystemID, section, userA.Account().ID, models.LockActionTypeNormal)
	s.NoError(err)
	s.True(unlocked)

	// Now User B can lock the section
	locked, err = LockSystemProfileSection(ps, cedarSystemID, section, userB)
	s.NoError(err)
	s.True(locked)

	// Verify User B's lock exists
	locks, err = GetSystemProfileSectionLocks(cedarSystemID)
	s.NoError(err)
	s.Len(locks, 1)
	s.Equal(userB.Account().ID, locks[0].LockedByUserAccount.ID)
}

func (s *ResolverSuite) TestUnlockAllSystemProfileSections() {
	cedarSystemID := "b105ddf3-c758-4f13-a520-976ffb1be680"
	ps := pubsub.NewServicePubSub()
	principal := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, "ABCD", false)
	defer cleanupSystemProfileLocks(ps, cedarSystemID)

	// Lock multiple sections
	section1 := models.SystemProfileLockableSectionBusinessInformation
	section2 := models.SystemProfileLockableSectionData
	section3 := models.SystemProfileLockableSectionTeam

	locked1, err := LockSystemProfileSection(ps, cedarSystemID, section1, principal)
	s.NoError(err)
	s.True(locked1)

	locked2, err := LockSystemProfileSection(ps, cedarSystemID, section2, principal)
	s.NoError(err)
	s.True(locked2)

	locked3, err := LockSystemProfileSection(ps, cedarSystemID, section3, principal)
	s.NoError(err)
	s.True(locked3)

	// Verify all sections are locked
	locks, err := GetSystemProfileSectionLocks(cedarSystemID)
	s.NoError(err)
	s.Len(locks, 3)

	// Unlock all sections
	deletedSections, err := UnlockAllSystemProfileSections(ps, cedarSystemID)
	s.NoError(err)
	s.Len(deletedSections, 3)

	// Verify all sections match what was deleted
	deletedSectionTypes := make(map[models.SystemProfileLockableSection]bool)
	for _, deleted := range deletedSections {
		deletedSectionTypes[deleted.Section] = true
	}
	s.True(deletedSectionTypes[section1])
	s.True(deletedSectionTypes[section2])
	s.True(deletedSectionTypes[section3])

	// Verify no locks remain
	locks, err = GetSystemProfileSectionLocks(cedarSystemID)
	s.NoError(err)
	s.Empty(locks)
}

func (s *ResolverSuite) TestLockSystemProfileSectionAsAdmin() {
	cedarSystemID := "97862207-b502-440a-9392-318b2b261434"
	section := models.SystemProfileLockableSectionData
	ps := pubsub.NewServicePubSub()
	defer cleanupSystemProfileLocks(ps, cedarSystemID)

	s.Run("regular user lock should not have admin flag", func() {
		regularUser := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, "ABCD", false)
		locked, err := LockSystemProfileSection(ps, cedarSystemID, section, regularUser)
		s.NoError(err)
		s.True(locked)

		locks, err := GetSystemProfileSectionLocks(cedarSystemID)
		s.NoError(err)
		s.Len(locks, 1)
		s.False(locks[0].IsAdmin, "Regular user should not have isAdmin flag")

		// Unlock before next test section
		_, err = UnlockSystemProfileSection(ps, cedarSystemID, section, regularUser.Account().ID, models.LockActionTypeNormal)
		s.NoError(err)
	})

	s.Run("admin user lock should have admin flag", func() {
		adminUser := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, "USR1", true)
		locked, err := LockSystemProfileSection(ps, cedarSystemID, section, adminUser)
		s.NoError(err)
		s.True(locked)

		locks, err := GetSystemProfileSectionLocks(cedarSystemID)
		s.NoError(err)
		s.Len(locks, 1)
		s.True(locks[0].IsAdmin, "GRT admin user should have isAdmin flag")
	})
}
