package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestCreateTRBRequestForm() {
	ctx := context.Background()
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	_, err := s.store.CreateTRBRequest(s.logger, trbRequest)
	s.NoError(err)

	s.Run("create a TRB request form", func() {
		form := models.TRBRequestForm{
			TRBRequestID:             trbRequest.ID,
			Component:                "The Citadel of Ricks",
			NeedsAssistanceWith:      "An application",
			HasSolutionInMind:        false,
			WhereInProcess:           models.TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway,
			HasExpectedStartEndDates: false,
		}
		form.CreatedBy = anonEua
		createdForm, err := s.store.CreateTRBRequestForm(ctx, &form)
		s.NoError(err)

		createdForm.ModifiedBy = &anonEua
		_, err = s.store.UpdateTRBRequestForm(ctx, createdForm)
		s.NoError(err)

		createdForm.Component = "Taco Truck"
		createdForm.ModifiedBy = &anonEua
		_, err = s.store.UpdateTRBRequestForm(ctx, createdForm)
		s.NoError(err)
	})

	s.Run("fetches TRB request forms", func() {
		fetched, err := s.store.GetTRBRequestFormsByTRBRequestID(ctx, trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
