package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequestForm makes a new TRB request
func (s *ResolverSuite) TestCreateTRBRequestForm() {
	ctx := context.Background()
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("create/update/fetch TRB request forms", func() {
		form := models.TRBRequestForm{
			TRBRequestID: trbRequest.ID,
		}
		form.CreatedBy = anonEua
		createdForm, err := CreateTRBRequestForm(ctx, s.testConfigs.Store, &form)
		s.NoError(err)

		// createdForm.Role = models.PersonRoleCloudNavigator
		createdForm.ModifiedBy = &anonEua
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, createdForm)
		s.NoError(err)
		// s.EqualValues(updatedForm.Role, models.PersonRoleCloudNavigator)
		s.EqualValues(updatedForm.ModifiedBy, &anonEua)

		createdForm.Component = "The Citadel of Ricks"
		createdForm.ModifiedBy = &anonEua
		updatedForm, err = UpdateTRBRequestForm(ctx, s.testConfigs.Store, createdForm)
		s.NoError(err)
		s.EqualValues(updatedForm.Component, "The Citadel of Ricks")
		s.EqualValues(updatedForm.ModifiedBy, &anonEua)
	})

	s.Run("fetches TRB request forms", func() {
		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)
	})
}
