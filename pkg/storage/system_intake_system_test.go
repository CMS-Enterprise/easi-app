package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
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
		for i := 0; i < 3; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("link to systems %d", i),
			}

			created, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// insert systems for this created system intake
		systemNumbers := []string{
			system1,
			system2,
			system3,
		}
		for _, systemIntakeID := range createdIDs {
			err := sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
				return s.store.SetSystemIntakeSystems(ctx, tx, systemIntakeID, systemNumbers)
			})
			s.NoError(err)
		}

		results, err := s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, createdIDs)
		s.NoError(err)

		data := helpers.OneToMany[*models.SystemIntakeSystem](createdIDs, results)
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
		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, createdIDs[0], append(systemNumbers, system4))
		})
		s.NoError(err)

		results, err = s.store.SystemIntakeSystemsBySystemIntakeIDs(ctx, []uuid.UUID{createdIDs[0]})
		s.NoError(err)

		data = helpers.OneToMany[*models.SystemIntakeSystem]([]uuid.UUID{createdIDs[0]}, results)
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

			if system.SystemID == system4 {
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

func (s *StoreTestSuite) TestSystemIntakesByCedarSystemID() {
	ctx := context.Background()

	var (
		open1 uuid.UUID
		open2 uuid.UUID

		closed uuid.UUID
	)

	const (
		system1 = "1"
		system2 = "2"
		system3 = "3"
		system4 = "4"
	)

	s.Run("test getting system intakes by cedar system id", func() {
		// create some intakes
		intake1 := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			State:       models.SystemIntakeStateOpen,
		}

		create1, err := s.store.CreateSystemIntake(ctx, &intake1)
		s.NoError(err)
		s.NotNil(create1)

		open1 = create1.ID

		intake2 := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			State:       models.SystemIntakeStateOpen,
		}

		create2, err := s.store.CreateSystemIntake(ctx, &intake2)
		s.NoError(err)
		s.NotNil(create2)

		open2 = create2.ID

		intake3 := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			State:       models.SystemIntakeStateClosed,
		}

		create3, err := s.store.CreateSystemIntake(ctx, &intake3)
		s.NoError(err)
		s.NotNil(create3)

		closed = create3.ID

		// link all systems to all system intakes
		systemNumbers := []string{
			system1,
			system2,
			system3,
			system4,
		}

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, open1, systemNumbers)
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, open2, systemNumbers)
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeSystems(ctx, tx, closed, systemNumbers)
		})
		s.NoError(err)

		results, err := s.store.SystemIntakesByCedarSystemID(ctx, system1, models.SystemIntakeStateOpen)
		s.NoError(err)
		s.Len(results, 2)

		foundClosed := false

		for _, result := range results {
			if result.ID == closed {
				foundClosed = true
				break
			}
		}

		s.False(foundClosed)

		// now get the closed one
		results, err = s.store.SystemIntakesByCedarSystemID(ctx, system1, models.SystemIntakeStateClosed)
		s.NoError(err)
		s.Len(results, 1)
		s.Equal(results[0].ID, closed)
	})
}
