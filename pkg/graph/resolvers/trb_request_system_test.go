package resolvers

import (
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
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

		data, err := TRBRequestSystems(ctx, createdIDs[0])
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
		data, err = TRBRequestSystems(ctx, createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})
}
