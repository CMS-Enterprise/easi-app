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
		form := map[string]interface{}{
			"trbRequestId":             trbRequest.ID,
			"needsAssistanceWith":      "All the things",
			"hasSolutionInMind":        false,
			"whereInProcess":           models.TRBWhereInProcessOptionUnknown,
			"hasExpectedStartEndDates": false,
			"collabGroups": []models.TRBCollabGroupOption{
				models.TRBCollabGroupOptionSecurity,
				models.TRBCollabGroupOptionCloud,
			},
			"component": "Taco Cart",
			"createdBy": anonEua,
		}
		createdForm, err := CreateTRBRequestForm(ctx, s.testConfigs.Store, form)
		s.NoError(err)
		s.EqualValues(createdForm.NeedsAssistanceWith, form["needsAssistanceWith"])
		s.EqualValues(createdForm.HasSolutionInMind, form["hasSolutionInMind"])
		s.EqualValues(createdForm.WhereInProcess, form["whereInProcess"])
		s.EqualValues(createdForm.HasExpectedStartEndDates, form["hasExpectedStartEndDates"])
		// s.EqualValues(createdForm.CollabGroups, form["collabGroups"])

		createdForm.ModifiedBy = &anonEua
		formChanges := map[string]interface{}{
			"trbRequestId":             trbRequest.ID,
			"needsAssistanceWith":      "Some of the things",
			"hasSolutionInMind":        true,
			"whereInProcess":           models.TRBWhereInProcessOptionContractingWorkHasStarted,
			"hasExpectedStartEndDates": true,
			"collabGroups": []models.TRBCollabGroupOption{
				models.TRBCollabGroupOptionSecurity,
				models.TRBCollabGroupOptionCloud,
				models.TRBCollabGroupOptionPrivacyAdvisor,
			},
			"component": "Taco Cart",
		}
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, formChanges)
		s.NoError(err)
		s.EqualValues(updatedForm.ModifiedBy, &anonEua)
		s.EqualValues(createdForm.NeedsAssistanceWith, form["needsAssistanceWith"])
		s.EqualValues(createdForm.HasSolutionInMind, form["hasSolutionInMind"])
		s.EqualValues(createdForm.WhereInProcess, form["whereInProcess"])
		s.EqualValues(createdForm.HasExpectedStartEndDates, form["hasExpectedStartEndDates"])
		// s.EqualValues(createdForm.CollabGroups, form["collabGroups"])

		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)
	})
}
