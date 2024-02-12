package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s *ResolverSuite) TestContractNumbers() {
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, s.testConfigs.Logger)

	ctx = dataloaders.CTXWithLoaders(ctx, dataloaders.NewDataLoaders(s.testConfigs.Store, func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil }))

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
	)

	var createdIDs []uuid.UUID

	// create system intake
	s.Run("create system intake for test", func() {
		for i := 0; i < 2; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("system intake contract number data loader %d", i),
			}

			created, err := s.testConfigs.Store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// set contract for the created system intake
		// insert contracts for this created system intake
		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}

		_, err := sqlutils.WithTransaction[any](s.testConfigs.Store, func(tx *sqlx.Tx) (*any, error) {
			s.NoError(s.testConfigs.Store.SetSystemIntakeContractNumbers(ctx, tx, createdIDs[0], contractNumbers))
			return nil, nil
		})
		s.NoError(err)

		data, err := ContractNumbers(ctx, createdIDs[0])
		s.NoError(err)
		s.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			s.Equal(result.SystemIntakeID, createdIDs[0])

			if result.ContractNumber == contract1 {
				found1 = true
			}

			if result.ContractNumber == contract2 {
				found2 = true
			}

			if result.ContractNumber == contract3 {
				found3 = true
			}
		}

		s.True(found1)
		s.True(found2)
		s.True(found3)

		// attempt to get contract numbers for a system intake without linked contracts
		data, err = ContractNumbers(ctx, createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})
}
