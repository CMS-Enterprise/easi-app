package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *StoreTestSuite) TestLinkSystemIntakeSystems() {
	ctx := context.Background()

	const (
		system1 = "1"
		system2 = "2"
		system3 = "3"
		system4 = "4"
	)

	var createdIDs []uuid.UUID

	s.Run("sets systems on a system intake", func() {
		// create three intakes
		createdIntakes := make([]*models.SystemIntake, 0)
		for i := 0; i < 3; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("link to systems %d", i),
			}

			created, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
			createdIntakes = append(createdIntakes, created)
		}

		// insert systems for this created system intake
		idOne := "1"
		idTwo := "2"
		idThree := "3"
		idFour := "4"
		descriptionOne := "other text description"
		linkedSystems := []*models.SystemRelationshipInput{
			{
				CedarSystemID:                      &idOne,
				SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
				OtherSystemRelationshipDescription: &descriptionOne,
			},
			{
				CedarSystemID:          &idTwo,
				SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
			},
			{
				CedarSystemID:          &idThree,
				SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
			},
		}

		for _, systemIntake := range createdIntakes {
			err := sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
				return s.store.SetSystemIntakeSystems(ctx, tx, systemIntake.ID, linkedSystems)
			})
			s.NoError(err)
		}

		results, err := s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, createdIDs)
		s.NoError(err)

		data := helpers.OneToMany(createdIDs, results)
		s.Equal(len(data), len(createdIDs))

		for i, systemIntakeID := range createdIDs {
			systemsFound := data[i]
			s.Len(systemsFound, 3)

			var (
				found1 bool
				found2 bool
				found3 bool
			)

			for _, system := range systemsFound {
				s.Equal(systemIntakeID, system.SystemIntakeID)
				if system.SystemID == system1 {
					found1 = true
				}

				if system.SystemID == system2 {
					found2 = true
				}

				if system.SystemID == system3 {
					found3 = true
				}
			}

			s.True(found1)
			s.True(found2)
			s.True(found3)
		}

		// now, we can add system 4 to one of the system intakes and verify that the created_at dates for the first three remain unchanged
		system4 := models.SystemRelationshipInput{
			CedarSystemID:          &idFour,
			SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
		}
		linkedSystems = append(linkedSystems, &system4)

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			// append(systemNumbers, system4)
			return s.store.SetSystemIntakeSystems(ctx, tx, createdIntakes[0].ID, linkedSystems)
		})
		s.NoError(err)

		results, err = s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIDs[0]})
		s.NoError(err)

		data = helpers.OneToMany([]uuid.UUID{createdIDs[0]}, results)
		s.Len(data, 1)
		systemsFound := data[0]
		s.Len(systemsFound, 4)

		var (
			firstThreeSystemsTime time.Time
			fourthSystemTime      time.Time
		)

		for _, system := range systemsFound {
			s.Equal(createdIDs[0], system.SystemIntakeID)
			if system.SystemID == system1 ||
				system.SystemID == system2 ||
				system.SystemID == system3 {
				firstThreeSystemsTime = system.CreatedAt
			}

			if system.SystemID == *system4.CedarSystemID {
				fourthSystemTime = system.CreatedAt
			}
		}

		s.False(firstThreeSystemsTime.IsZero())
		s.False(fourthSystemTime.IsZero())

		_, err = s.db.Exec("DELETE FROM system_intakes WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}

func (s *StoreTestSuite) TestDeleteSystemIntakeSystemByID() {
	ctx := context.Background()

	s.Run("deletes a specific linked system for a system intake", func() {
		// Step 1: Create a system intake
		intake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "delete system test",
		}
		createdIntake, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		// Step 2: Link multiple systems
		idOne := "system-1"
		idTwo := "system-2"
		linkedSystems := []*models.SystemRelationshipInput{
			{
				CedarSystemID:          &idOne,
				SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
			},
			{
				CedarSystemID:          &idTwo,
				SystemRelationshipType: []models.SystemRelationshipType{"OTHER"},
			},
		}

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, createdIntake.ID, linkedSystems)
		})
		s.NoError(err)

		// Step 3: Fetch and confirm both systems exist
		allSystems, err := s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIntake.ID})
		s.NoError(err)
		s.Len(allSystems, 2)

		// Step 4: Delete one of them
		var toDeleteID uuid.UUID
		for _, sys := range allSystems {
			if sys.SystemID == idOne {
				toDeleteID = sys.ID
				break
			}
		}
		s.False(toDeleteID == uuid.Nil)

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.DeleteSystemIntakeSystemByID(ctx, tx, toDeleteID)
		})
		s.NoError(err)

		// Step 5: Fetch again and confirm only the second system remains
		remainingSystems, err := s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIntake.ID})
		s.NoError(err)
		s.Len(remainingSystems, 1)
		s.Equal(idTwo, remainingSystems[0].SystemID)

		// Cleanup
		_, err = s.db.Exec("DELETE FROM system_intakes WHERE id = $1", createdIntake.ID)
		s.NoError(err)
	})
}

func (s *StoreTestSuite) TestUpdateSystemIntakeSystemByID() {
	ctx := context.Background()

	s.Run("updates a specific linked system's relationship type and description", func() {
		// Step 1: Create a system intake
		intake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "update system test",
		}
		createdIntake, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		// Step 2: Link a system
		systemID := "system-to-update"
		initialDescription := "initial description"
		initialRelationship := []models.SystemRelationshipType{"PRIMARY_SUPPORT"}

		linkedSystems := []*models.SystemRelationshipInput{
			{
				CedarSystemID:                      &systemID,
				SystemRelationshipType:             initialRelationship,
				OtherSystemRelationshipDescription: &initialDescription,
			},
		}

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, createdIntake.ID, linkedSystems)
		})
		s.NoError(err)

		// Step 3: Get the inserted system to update
		allSystems, err := s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIntake.ID})
		s.NoError(err)
		s.Len(allSystems, 1)

		original := allSystems[0]
		s.Equal(systemID, original.SystemID)
		s.Equal(initialRelationship, original.SystemRelationshipType)
		s.Equal(initialDescription, *original.OtherSystemRelationshipDescription)

		// Step 4: Prepare the update input
		newRelationship := []models.SystemRelationshipType{"OTHER", "IMPACTS_SELECTED_SYSTEM"}
		newDescription := "updated description"
		updateInput := models.UpdateSystemLinkInput{
			ID:                                 original.ID,
			SystemID:                           &original.SystemID,
			SystemRelationshipType:             newRelationship,
			OtherSystemRelationshipDescription: &newDescription,
		}

		// Step 5: Perform the update
		var updated *models.SystemIntakeSystem
		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			updated, err = s.store.UpdateSystemIntakeSystemByID(ctx, tx, updateInput)
			return err
		})
		s.NoError(err)

		// Step 6: Validate the updated values
		s.Equal(original.ID, updated.ID)
		s.Equal(systemID, updated.SystemID)
		s.ElementsMatch(newRelationship, updated.SystemRelationshipType)
		s.Equal(newDescription, *updated.OtherSystemRelationshipDescription)

		// Optionally fetch again from DB to verify persisted state
		allSystems, err = s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIntake.ID})
		s.NoError(err)
		s.Len(allSystems, 1)

		verified := allSystems[0]
		s.ElementsMatch(newRelationship, verified.SystemRelationshipType)
		s.Equal(newDescription, *verified.OtherSystemRelationshipDescription)

		// Cleanup
		_, err = s.db.Exec("DELETE FROM system_intakes WHERE id = $1", createdIntake.ID)
		s.NoError(err)
	})
}

func (s *StoreTestSuite) TestGetLinkedSystemByID() {
	ctx := context.Background()

	s.Run("retrieves a specific linked system by its ID", func() {
		// Step 1: Create a system intake
		intake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "get system test",
		}
		createdIntake, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		// Step 2: Link a system
		systemID := "system-to-get"
		relationshipTypes := []models.SystemRelationshipType{"USES_OR_IMPACTED_BY_SELECTED_SYSTEM"}

		linkedSystems := []*models.SystemRelationshipInput{
			{
				CedarSystemID:          &systemID,
				SystemRelationshipType: relationshipTypes,
			},
		}

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, createdIntake.ID, linkedSystems)
		})
		s.NoError(err)

		// Step 3: Fetch the record to get the ID
		allSystems, err := s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIntake.ID})
		s.NoError(err)
		s.Len(allSystems, 1)

		inserted := allSystems[0]

		// Step 4: Get the linked system by ID
		fetched, err := s.store.GetLinkedSystemByID(ctx, inserted.ID)
		s.NoError(err)
		s.NotNil(fetched)

		// Step 5: Verify fields
		s.Equal(inserted.ID, fetched.ID)
		s.Equal(systemID, fetched.SystemID)
		s.ElementsMatch(relationshipTypes, fetched.SystemRelationshipType)

		// Cleanup
		_, err = s.db.Exec("DELETE FROM system_intakes WHERE id = $1", createdIntake.ID)
		s.NoError(err)
	})

	s.Run("returns nil for nonexistent ID", func() {
		missingID := uuid.New()
		found, err := s.store.GetLinkedSystemByID(ctx, missingID)
		s.NoError(err)
		s.Nil(found)
	})
}
