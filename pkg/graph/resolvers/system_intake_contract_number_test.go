package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (suite *ResolverSuite) TestSystemIntakeContractNumbers() {
	ctx := suite.testConfigs.Context

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
	)

	var createdIDs []uuid.UUID

	// create system intake
	suite.Run("create system intake for test", func() {
		for i := 0; i < 2; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("system intake contract number data loader %d", i),
			}

			created, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &intake)
			suite.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// set contract for the created system intake
		// insert contracts for this created system intake
		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}

		err := sqlutils.WithTransaction(ctx, suite.testConfigs.Store, func(tx *sqlx.Tx) error {
			return suite.testConfigs.Store.SetSystemIntakeContractNumbers(ctx, tx, createdIDs[0], contractNumbers)
		})
		suite.NoError(err)

		data, err := SystemIntakeContractNumbers(suite.ctxWithNewDataloaders(), createdIDs[0])
		suite.NoError(err)
		suite.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			suite.Equal(result.SystemIntakeID, createdIDs[0])

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

		// attempt to get contract numbers for a system intake without linked contracts
		data, err = SystemIntakeContractNumbers(suite.ctxWithNewDataloaders(), createdIDs[1])
		suite.NoError(err)
		suite.Empty(data)
	})
}
