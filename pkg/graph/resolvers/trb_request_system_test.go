package resolvers

import (
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *ResolverSuite) TestTRBRequestRelatedSystems() {
	ctx := s.testConfigs.Context

	const (
		systemID1 = "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
		systemID2 = "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"
		systemID3 = "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	)

	var createdIDs []uuid.UUID

	// create trb request
	s.Run("create trb requests for test", func() {
		for i := 0; i < 2; i++ {
			created, err := CreateTRBRequest(ctx, models.TRBTBrainstorm, s.testConfigs.Store)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// set contract for the created trb request
		// insert systems for this created trb request
		systemIDs := []string{
			systemID1,
			systemID2,
			systemID3,
		}

		err := sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetTRBRequestSystems(ctx, tx, createdIDs[0], systemIDs)
		})
		s.NoError(err)

		data, err := TRBRequestSystems(s.ctxWithNewDataloaders(), createdIDs[0])
		s.NoError(err)
		s.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			if result.ID.String == systemID1 {
				found1 = true
			}

			if result.ID.String == systemID2 {
				found2 = true
			}

			if result.ID.String == systemID3 {
				found3 = true
			}
		}

		s.True(found1)
		s.True(found2)
		s.True(found3)

		// attempt to get systems for a trb request without linked systems
		data, err = TRBRequestSystems(s.ctxWithNewDataloaders(), createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})
}

func (s *ResolverSuite) TestTRBRequestsByCedarSystemID() {
	ctx := s.testConfigs.Context

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

		create1, err := s.testConfigs.Store.CreateTRBRequest(ctx, s.testConfigs.Store, &trb1)
		s.NoError(err)
		s.NotNil(create1)

		open1 = create1.ID

		trb2 := models.TRBRequest{
			Type:  models.TRBTBrainstorm,
			State: models.TRBRequestStateOpen,
		}

		trb2.CreatedBy = testhelpers.RandomEUAIDNull().String

		create2, err := s.testConfigs.Store.CreateTRBRequest(ctx, s.testConfigs.Store, &trb2)
		s.NoError(err)
		s.NotNil(create2)

		open2 = create2.ID

		trb3 := models.TRBRequest{
			Type:  models.TRBTBrainstorm,
			State: models.TRBRequestStateClosed,
		}

		trb3.CreatedBy = testhelpers.RandomEUAIDNull().String

		create3, err := s.testConfigs.Store.CreateTRBRequest(ctx, s.testConfigs.Store, &trb3)
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

		err = sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetTRBRequestSystems(ctx, tx, open1, systemNumbers)
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetTRBRequestSystems(ctx, tx, open2, systemNumbers)
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetTRBRequestSystems(ctx, tx, closed, systemNumbers)
		})
		s.NoError(err)

		results, err := CedarSystemLinkedTRBRequests(s.ctxWithNewDataloaders(), system1, models.TRBRequestStateOpen)
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
		results, err = CedarSystemLinkedTRBRequests(s.ctxWithNewDataloaders(), system1, models.TRBRequestStateClosed)
		s.NoError(err)
		s.Len(results, 1)
		s.Equal(results[0].ID, closed)
	})
}
