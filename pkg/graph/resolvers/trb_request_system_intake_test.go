package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestTRBRequestLCIDCrud tests creation/deletion of TRB request LCIDs
func (s *ResolverSuite) TestTRBRequestLCID() {
	ctx := context.Background()
	anonEua := "ANON"
	store := s.testConfigs.Store

	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, store, nil)
	s.NoError(err)

	lcids := []string{"111111", "111222", "111333"}
	intakes := make([]*models.SystemIntake, 3)
	var intakeIDToDelete uuid.UUID
	for i, lcid := range lcids {
		intake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusLCIDISSUED,
			RequestType: models.SystemIntakeRequestTypeMAJORCHANGES,
		})
		s.NoError(err)
		intake.LifecycleID = null.StringFrom(lcid)
		intake, err = store.UpdateSystemIntake(ctx, intake)
		s.NoError(err)
		intakes[i] = intake

		// We will delete this one later for testing deletion
		if lcid == "111222" {
			intakeIDToDelete = intake.ID
		}
	}

	s.Run("create/read/delete TRB request system intakes", func() {
		for _, intake := range intakes {
			_, err := CreateTRBRequestSystemIntake(ctx, store, trbRequest.ID, intake.ID)
			s.NoError(err)
		}

		trbIntakes, err := GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(3, len(trbIntakes))

		for i, intake := range intakes {
			s.EqualValues(intake.ID, trbIntakes[i].ID)
		}

		_, err = DeleteTRBRequestSystemIntake(ctx, store, trbRequest.ID, intakeIDToDelete)
		s.NoError(err)
		trbIntakes, err = GetTRBRequestSystemIntakesByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(2, len(trbIntakes))

		// Make a set to verify that the two expected LCIDs are represented by the two intakes left
		lcidSet := make(map[string]bool)
		lcidSet[trbIntakes[0].LifecycleID.ValueOrZero()] = true
		lcidSet[trbIntakes[1].LifecycleID.ValueOrZero()] = true
		s.True(lcidSet["111111"])
		s.True(lcidSet["111333"])
	})
}
