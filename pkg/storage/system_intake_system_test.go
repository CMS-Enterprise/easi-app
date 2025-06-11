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
				CedarSystemID:          &idOne,
				SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
				OtherTypeDescription:   &descriptionOne,
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

		s.True(fourthSystemTime.After(firstThreeSystemsTime))

		_, err = s.db.Exec("DELETE FROM system_intakes WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}
