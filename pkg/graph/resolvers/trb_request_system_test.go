package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

func (s *ResolverSuite) TestTRBRequestRelatedSystems() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, s.testConfigs.Logger)

	ctx = dataloaders.CTXWithLoaders(
		ctx,
		dataloaders.NewDataLoaders(
			s.testConfigs.Store,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		),
	)

	const (
		systemID1 = "1"
		systemID2 = "2"
		systemID3 = "3"
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

		data, err := TRBRequestSystems(ctx, mockGetCedarSystem, createdIDs[0])
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
		data, err = TRBRequestSystems(ctx, mockGetCedarSystem, createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})
}
