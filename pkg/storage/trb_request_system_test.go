package storage

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s *StoreTestSuite) TestLinkTRBRequestSystems() {
	ctx := context.Background()

	const (
		system1 = "1"
		system2 = "2"
		system3 = "3"
		system4 = "4"
	)

	var createdIDs []uuid.UUID

	s.Run("sets systems on a trb request", func() {
		// create three trb requests
		_, err := sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			for i := 0; i < 3; i++ {
				trbRequest := models.NewTRBRequest(testhelpers.RandomEUAIDNull().String)
				trbRequest.Type = models.TRBTBrainstorm
				trbRequest.State = models.TRBRequestStateOpen
				created, err := s.store.CreateTRBRequest(ctx, tx, trbRequest)
				s.NoError(err)
				createdIDs = append(createdIDs, created.ID)
			}
			return nil, nil
		})
		s.NoError(err)

		// insert systems for this created trb request
		systemNumbers := []string{
			system1,
			system2,
			system3,
		}
		_, err = sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			for _, trbRequestID := range createdIDs {
				s.NoError(s.store.SetTRBRequestSystems(ctx, tx, trbRequestID, systemNumbers))
			}
			return nil, nil
		})
		s.NoError(err)

		data, err := s.store.TRBRequestSystemsByTRBRequestIDLOADER(ctx, formatParamTableJSON("trb_request_id", createdIDs))
		s.NoError(err)

		for _, trbRequestID := range createdIDs {
			systemsFound, ok := data[trbRequestID.String()]
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

		// now, we can add system 4 to one of the trb requests and verify that the created_at dates for the first three remain unchanged
		_, err = sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			s.NoError(s.store.SetTRBRequestSystems(ctx, tx, createdIDs[0], append(systemNumbers, system4)))
			return nil, nil
		})
		s.NoError(err)

		data, err = s.store.TRBRequestSystemsByTRBRequestIDLOADER(ctx, formatParamTableJSON("trb_request_id", []uuid.UUID{createdIDs[0]}))
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

		_, err = s.db.Exec("DELETE FROM trb_request WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}
