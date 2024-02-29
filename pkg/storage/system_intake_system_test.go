package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

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
			_, err := sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
				s.NoError(s.store.SetSystemIntakeSystems(ctx, tx, systemIntakeID, systemNumbers))
				return nil, nil
			})
			s.NoError(err)
		}

		data, err := s.store.SystemIntakeSystemsBySystemIntakeIDLOADER(ctx, formatParamTableJSON("system_intake_id", createdIDs))
		s.NoError(err)

		for _, systemIntakeID := range createdIDs {
			systemsFound, ok := data[systemIntakeID.String()]
			s.True(ok)
			s.Len(systemsFound, 3)

			var (
				found1 bool
				found2 bool
				found3 bool
			)

			for _, system := range systemsFound {
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
		_, err = sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			s.NoError(s.store.SetSystemIntakeSystems(ctx, tx, createdIDs[0], append(systemNumbers, system4)))
			return nil, nil
		})
		s.NoError(err)

		data, err = s.store.SystemIntakeSystemsBySystemIntakeIDLOADER(ctx, formatParamTableJSON("system_intake_id", []uuid.UUID{createdIDs[0]}))
		s.NoError(err)
		systemsFound, ok := data[createdIDs[0].String()]
		s.True(ok)
		s.Len(systemsFound, 4)

		var (
			firstThreesystemsTime time.Time
			fourthsystemTime      time.Time
		)

		for _, system := range systemsFound {
			if system.SystemID == system1 ||
				system.SystemID == system2 ||
				system.SystemID == system3 {
				firstThreesystemsTime = system.CreatedAt
			}

			if system.SystemID == system4 {
				fourthsystemTime = system.CreatedAt
			}
		}

		s.False(firstThreesystemsTime.IsZero())
		s.False(fourthsystemTime.IsZero())

		s.True(fourthsystemTime.After(firstThreesystemsTime))

		_, err = s.db.ExecContext(ctx, "DELETE FROM system_intakes WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}
