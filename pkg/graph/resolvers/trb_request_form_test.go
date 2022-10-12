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
		initialCollabGroups := []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionSecurity,
			models.TRBCollabGroupOptionCloud,
		}
		form := map[string]interface{}{
			"trbRequestId":             trbRequest.ID,
			"needsAssistanceWith":      "All the things",
			"hasSolutionInMind":        false,
			"whereInProcess":           models.TRBWhereInProcessOptionUnknown,
			"hasExpectedStartEndDates": false,
			"collabGroups":             initialCollabGroups,
			"component":                "Taco Cart",
			"createdBy":                anonEua,
		}
		createdForm, err := CreateTRBRequestForm(ctx, s.testConfigs.Store, form)
		s.NoError(err)
		s.EqualValues(createdForm.NeedsAssistanceWith, form["needsAssistanceWith"])
		s.EqualValues(createdForm.HasSolutionInMind, form["hasSolutionInMind"])
		s.EqualValues(createdForm.WhereInProcess, form["whereInProcess"])
		s.EqualValues(createdForm.HasExpectedStartEndDates, form["hasExpectedStartEndDates"])
		s.EqualValues(createdForm.CollabGroups[0], initialCollabGroups[0])
		s.EqualValues(createdForm.CollabGroups[1], initialCollabGroups[1])
		s.EqualValues(len(createdForm.CollabGroups), 2)

		createdForm.ModifiedBy = &anonEua
		updatedCollabGroups := []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionSecurity,
			models.TRBCollabGroupOptionCloud,
			models.TRBCollabGroupOptionPrivacyAdvisor,
		}
		formChanges := map[string]interface{}{
			"trbRequestId":             trbRequest.ID,
			"needsAssistanceWith":      "Some of the things",
			"hasSolutionInMind":        true,
			"whereInProcess":           models.TRBWhereInProcessOptionContractingWorkHasStarted,
			"hasExpectedStartEndDates": true,
			"collabGroups":             updatedCollabGroups,
			"component":                "Taco Cart",
		}
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, formChanges)
		s.NoError(err)
		s.EqualValues(updatedForm.ModifiedBy, &anonEua)
		s.EqualValues(updatedForm.NeedsAssistanceWith, formChanges["needsAssistanceWith"])
		s.EqualValues(updatedForm.HasSolutionInMind, formChanges["hasSolutionInMind"])
		s.EqualValues(updatedForm.WhereInProcess, formChanges["whereInProcess"])
		s.EqualValues(updatedForm.HasExpectedStartEndDates, formChanges["hasExpectedStartEndDates"])
		s.EqualValues(updatedForm.CollabGroups[0], updatedCollabGroups[0])
		s.EqualValues(updatedForm.CollabGroups[1], updatedCollabGroups[1])
		s.EqualValues(updatedForm.CollabGroups[2], updatedCollabGroups[2])
		s.EqualValues(len(updatedForm.CollabGroups), 3)

		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)
	})
}
