package resolvers

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestTRBRequestLCIDCrud tests creation/deletion of TRB request LCIDs
func (suite *ResolverSuite) TestTRBRequestLCID() {
	ctx := suite.testConfigs.Context
	anonEua := "ANON"
	store := suite.testConfigs.Store

	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, store)
	suite.NoError(err)

	lcids := []string{"111111", "111222", "111333"}
	intakes := make([]*models.SystemIntake, 3)
	for i, lcid := range lcids {
		intake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeMAJORCHANGES,
		})
		suite.NoError(err)
		intake.LifecycleID = null.StringFrom(lcid)
		intake, err = store.UpdateSystemIntake(ctx, intake)
		suite.NoError(err)
		intakes[i] = intake
	}

	suite.Run("create/read/update TRB request system intakes", func() {
		trbIntakes, err := GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.Len(trbIntakes, 0)

		// Insert just 2
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			intakes[0].ID,
			intakes[1].ID,
			// intakes[2].ID,
		})
		suite.NoError(err)

		trbIntakes, err = GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.Len(trbIntakes, 2)

		// Make a set to verify that the two expected LCIDs are represented by the two intakes
		lcidSet := make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[1].LifecycleID.ValueOrZero()] = true
		suite.True(lcidSet["111111"])
		suite.True(lcidSet["111222"])
		suite.False(lcidSet["111333"])

		// Insert all 3
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			intakes[0].ID,
			intakes[1].ID,
			intakes[2].ID,
		})
		suite.NoError(err)

		trbIntakes, err = GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.Len(trbIntakes, 3)

		// Make a set to verify that the three expected LCIDs are represented by all three intakes
		lcidSet = make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[1].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[2].LifecycleID.ValueOrZero()] = true
		suite.True(lcidSet["111111"])
		suite.True(lcidSet["111222"])
		suite.True(lcidSet["111333"])

		// Insert just 1
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			// intakes[0].ID,
			// intakes[1].ID,
			intakes[2].ID,
		})
		suite.NoError(err)

		trbIntakes, err = GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.Len(trbIntakes, 1)

		// Make a set to verify that the two expected LCIDs are represented by the two intakes
		lcidSet = make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		suite.False(lcidSet["111111"])
		suite.False(lcidSet["111222"])
		suite.True(lcidSet["111333"])

		// Insert empty (should delete all)
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			// intakes[0].ID,
			// intakes[1].ID,
			// intakes[2].ID,
		})
		suite.NoError(err)

		trbIntakes, err = GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		suite.NoError(err)
		suite.Len(trbIntakes, 0)
	})
}
