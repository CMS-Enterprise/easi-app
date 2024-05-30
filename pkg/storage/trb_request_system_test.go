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
		err := sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			for i := 0; i < 3; i++ {
				trbRequest := models.NewTRBRequest(testhelpers.RandomEUAIDNull().String)
				trbRequest.Type = models.TRBTBrainstorm
				trbRequest.State = models.TRBRequestStateOpen
				created, err := s.store.CreateTRBRequest(ctx, tx, trbRequest)
				s.NoError(err)
				createdIDs = append(createdIDs, created.ID)
			}
			return nil
		})
		s.NoError(err)

		// insert systems for this created trb request
		systemNumbers := []string{
			system1,
			system2,
			system3,
		}
		for _, trbRequestID := range createdIDs {
			err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
				return s.store.SetTRBRequestSystems(ctx, tx, trbRequestID, systemNumbers)
			})
			s.NoError(err)
		}

		data, err := s.store.TRBRequestSystemsByTRBRequestIDLOADER(ctx, createdIDs)
		s.NoError(err)
		s.Equal(len(data), len(createdIDs))

		for i, trbRequestID := range createdIDs {
			systemsFound := data[i]
			s.Len(systemsFound, 3)

			var (
				found1 bool
				found2 bool
				found3 bool
			)

			for _, system := range systemsFound {
				s.Equal(trbRequestID, system.TRBRequestID)
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
		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetTRBRequestSystems(ctx, tx, createdIDs[0], append(systemNumbers, system4))
		})
		s.NoError(err)

		data, err = s.store.TRBRequestSystemsByTRBRequestIDLOADER(ctx, []uuid.UUID{createdIDs[0]})
		s.NoError(err)
		s.Len(data, 1)
		systemsFound := data[0]
		s.Len(systemsFound, 4)

		var (
			firstThreeSystemsTime time.Time
			fourthSystemTime      time.Time
		)

		for _, system := range systemsFound {
			s.Equal(createdIDs[0], system.TRBRequestID)
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

		_, err = s.db.Exec("DELETE FROM trb_request WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}

func (s *StoreTestSuite) TestTRBRequestsByCedarSystemID() {
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

	s.Run("test getting TRB requests by cedar system id", func() {
		// create trb requests
		trb1 := models.TRBRequest{
			Type:  models.TRBTBrainstorm,
			State: models.TRBRequestStateOpen,
		}
		trb1.CreatedBy = testhelpers.RandomEUAIDNull().String

		create1, err := s.store.CreateTRBRequest(ctx, s.store, &trb1)
		s.NoError(err)
		s.NotNil(create1)

		open1 = create1.ID

		trb2 := models.TRBRequest{
			Type:  models.TRBTBrainstorm,
			State: models.TRBRequestStateOpen,
		}

		trb2.CreatedBy = testhelpers.RandomEUAIDNull().String

		create2, err := s.store.CreateTRBRequest(ctx, s.store, &trb2)
		s.NoError(err)
		s.NotNil(create2)

		open2 = create2.ID

		trb3 := models.TRBRequest{
			Type:  models.TRBTBrainstorm,
			State: models.TRBRequestStateClosed,
		}

		trb3.CreatedBy = testhelpers.RandomEUAIDNull().String

		create3, err := s.store.CreateTRBRequest(ctx, s.store, &trb3)
		s.NoError(err)
		s.NotNil(create3)

		closed = create3.ID

		// link all systems to all TRBs
		systemNumbers := []string{
			system1,
			system2,
			system3,
			system4,
		}

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetTRBRequestSystems(ctx, tx, open1, systemNumbers)
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetTRBRequestSystems(ctx, tx, open2, systemNumbers)
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetTRBRequestSystems(ctx, tx, closed, systemNumbers)
		})
		s.NoError(err)

		results, err := s.store.TRBRequestsByCedarSystemID(ctx, system1, models.TRBRequestStateOpen)
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

		// now find the closed one
		results, err = s.store.TRBRequestsByCedarSystemID(ctx, system1, models.TRBRequestStateClosed)
		s.NoError(err)
		s.Len(results, 1)
		s.Equal(results[0].ID, closed)
	})
}
