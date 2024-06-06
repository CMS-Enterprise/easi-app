package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (suite *ResolverSuite) TestIntakeRelatedSystems() {
	ctx := suite.testConfigs.Context

	const (
		systemID1 = "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
		systemID2 = "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"
		systemID3 = "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	)

	var createdIDs []uuid.UUID

	// create system intake
	suite.Run("create system intakes for test", func() {
		for i := 0; i < 2; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("system intake system data loader %d", i),
			}

			created, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &intake)
			suite.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// set contract for the created system intake
		// insert systems for this created system intake
		systemIDs := []string{
			systemID1,
			systemID2,
			systemID3,
		}

		err := sqlutils.WithTransaction(ctx, suite.testConfigs.Store, func(tx *sqlx.Tx) error {
			return suite.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, createdIDs[0], systemIDs)
		})
		suite.NoError(err)

		data, err := SystemIntakeSystems(suite.ctxWithNewDataloaders(), createdIDs[0])
		suite.NoError(err)
		suite.Len(data, 3)

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

		suite.True(found1)
		suite.True(found2)
		suite.True(found3)

		// attempt to get systems for a system intake without linked systems
		data, err = SystemIntakeSystems(suite.ctxWithNewDataloaders(), createdIDs[1])
		suite.NoError(err)
		suite.Empty(data)
	})
}
