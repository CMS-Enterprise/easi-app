package resolvers

import (
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

func (suite *ResolverSuite) TestTRBRequestContractNumbers() {
	ctx := suite.testConfigs.Context

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
	)

	var createdIDs []uuid.UUID

	suite.Run("create TRB Requests for test", func() {
		for i := 0; i < 2; i++ {
			created, err := CreateTRBRequest(ctx, models.TRBTBrainstorm, suite.testConfigs.Store)
			suite.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}

		// set contract numbers on these TRB Requests
		err := sqlutils.WithTransaction(ctx, suite.testConfigs.Store, func(tx *sqlx.Tx) error {
			return suite.testConfigs.Store.SetTRBRequestContractNumbers(ctx, tx, createdIDs[0], contractNumbers)
		})
		suite.NoError(err)

		data, err := TRBRequestContractNumbers(suite.ctxWithNewDataloaders(), createdIDs[0])
		suite.NoError(err)
		suite.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			suite.Equal(result.TRBRequestID, createdIDs[0])

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

		suite.True(found1)
		suite.True(found2)
		suite.True(found3)

		// confirm second TRB Request does not have any contract numbers on it
		data, err = TRBRequestContractNumbers(suite.ctxWithNewDataloaders(), createdIDs[1])
		suite.NoError(err)
		suite.Empty(data)
	})

}
