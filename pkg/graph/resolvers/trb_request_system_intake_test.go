package resolvers

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// TestTRBRequestLCIDCrud tests creation/deletion of TRB request LCIDs
func (s *ResolverSuite) TestTRBRequestLCID() {
	ctx := s.testConfigs.Context
	anonEua := "ANON"
	store := s.testConfigs.Store

	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, store)
	s.NoError(err)

	lcids := []string{"111111", "111222", "111333"}
	intakes := make([]*models.SystemIntake, 3)
	for i, lcid := range lcids {
		intake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeMAJORCHANGES,
		})
		s.NoError(err)
		intake.LifecycleID = null.StringFrom(lcid)
		intake, err = store.UpdateSystemIntake(ctx, intake)
		s.NoError(err)
		intakes[i] = intake
	}

	s.Run("create/read/update TRB request system intakes", func() {
		trbIntakes, err := GetTRBRequestFormSystemIntakesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(trbIntakes, 0)

		// Insert just 2
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			intakes[0].ID,
			intakes[1].ID,
			// intakes[2].ID,
		})
		s.NoError(err)

		trbIntakes, err = GetTRBRequestFormSystemIntakesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(trbIntakes, 2)

		// Make a set to verify that the two expected LCIDs are represented by the two intakes
		lcidSet := make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[1].LifecycleID.ValueOrZero()] = true
		s.True(lcidSet["111111"])
		s.True(lcidSet["111222"])
		s.False(lcidSet["111333"])

		// Insert all 3
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			intakes[0].ID,
			intakes[1].ID,
			intakes[2].ID,
		})
		s.NoError(err)

		trbIntakes, err = GetTRBRequestFormSystemIntakesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(trbIntakes, 3)

		// Make a set to verify that the three expected LCIDs are represented by all three intakes
		lcidSet = make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[1].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[2].LifecycleID.ValueOrZero()] = true
		s.True(lcidSet["111111"])
		s.True(lcidSet["111222"])
		s.True(lcidSet["111333"])

		// Insert just 1
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			// intakes[0].ID,
			// intakes[1].ID,
			intakes[2].ID,
		})
		s.NoError(err)

		trbIntakes, err = GetTRBRequestFormSystemIntakesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(trbIntakes, 1)

		// Make a set to verify that the two expected LCIDs are represented by the two intakes
		lcidSet = make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		s.False(lcidSet["111111"])
		s.False(lcidSet["111222"])
		s.True(lcidSet["111333"])

		// Insert empty (should delete all)
		_, err = store.CreateTRBRequestSystemIntakes(ctx, trbRequest.ID, []uuid.UUID{
			// intakes[0].ID,
			// intakes[1].ID,
			// intakes[2].ID,
		})
		s.NoError(err)

		trbIntakes, err = GetTRBRequestFormSystemIntakesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(trbIntakes, 0)
	})
}
