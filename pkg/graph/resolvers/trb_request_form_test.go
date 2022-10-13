package resolvers

import (
	"context"
	"time"

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
		updatedCollabGroups := []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionSecurity,
			models.TRBCollabGroupOptionCloud,
			models.TRBCollabGroupOptionPrivacyAdvisor,
		}
		expectedStartDate, _ := time.Parse(time.RFC3339, "2022-10-10T12:00:00+00:00")
		expectedEndDate, _ := time.Parse(time.RFC3339, "2050-10-10T12:00:00+00:00")
		collabDateSecurity, _ := time.Parse(time.RFC3339, "2021-10-20T12:00:00+00:00")
		collabDateEnterpriseArchitecture, _ := time.Parse(time.RFC3339, "2021-10-21T12:00:00+00:00")
		collabDateCloud, _ := time.Parse(time.RFC3339, "2021-10-22T12:00:00+00:00")
		collabDatePrivacyAdvisor, _ := time.Parse(time.RFC3339, "2021-10-23T12:00:00+00:00")
		collabDateGovernanceReviewBoard, _ := time.Parse(time.RFC3339, "2021-10-24T12:00:00+00:00")
		collabDateOther, _ := time.Parse(time.RFC3339, "2021-10-25T12:00:00+00:00")
		formChanges := map[string]interface{}{
			"trbRequestId":                     trbRequest.ID,
			"component":                        "Taco Cart",
			"needsAssistanceWith":              "Some of the things",
			"hasSolutionInMind":                true,
			"proposedSolutionDescription":      "Tinder, but for cats",
			"whereInProcess":                   models.TRBWhereInProcessOptionContractingWorkHasStarted,
			"hasExpectedStartEndDates":         true,
			"expectedStartDate":                expectedStartDate,
			"expectedEndDate":                  expectedEndDate,
			"collabGroups":                     updatedCollabGroups,
			"collabDateSecurity":               collabDateSecurity,
			"collabDateEnterpriseArchitecture": collabDateEnterpriseArchitecture,
			"collabDateCloud":                  collabDateCloud,
			"collabDatePrivacyAdvisor":         collabDatePrivacyAdvisor,
			"collabDateGovernanceReviewBoard":  collabDateGovernanceReviewBoard,
			"collabDateOther":                  collabDateOther,
			"collabGroupOtherDescription":      "Geek Squad",
		}
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, formChanges)
		s.NoError(err)
		s.EqualValues(&anonEua, updatedForm.ModifiedBy)
		s.EqualValues(formChanges["needsAssistanceWith"], *updatedForm.NeedsAssistanceWith)
		s.EqualValues(formChanges["hasSolutionInMind"], *updatedForm.HasSolutionInMind)
		s.EqualValues(formChanges["proposedSolutionDescription"], *updatedForm.ProposedSolutionDescription)
		s.EqualValues(formChanges["whereInProcess"], *updatedForm.WhereInProcess)
		s.EqualValues(formChanges["hasExpectedStartEndDates"], *updatedForm.HasExpectedStartEndDates)
		s.True((*updatedForm.ExpectedStartDate).Equal(expectedStartDate))
		s.True((*updatedForm.ExpectedEndDate).Equal(expectedEndDate))
		s.EqualValues(updatedCollabGroups[0], updatedForm.CollabGroups[0])
		s.EqualValues(updatedCollabGroups[1], updatedForm.CollabGroups[1])
		s.EqualValues(updatedCollabGroups[2], updatedForm.CollabGroups[2])
		s.True((*updatedForm.CollabDateSecurity).Equal(collabDateSecurity))
		s.True((*updatedForm.CollabDateEnterpriseArchitecture).Equal(collabDateEnterpriseArchitecture))
		s.True((*updatedForm.CollabDateCloud).Equal(collabDateCloud))
		s.True((*updatedForm.CollabDatePrivacyAdvisor).Equal(collabDatePrivacyAdvisor))
		s.True((*updatedForm.CollabDateGovernanceReviewBoard).Equal(collabDateGovernanceReviewBoard))
		s.True((*updatedForm.CollabDateOther).Equal(collabDateOther))
		s.EqualValues(formChanges["collabGroupOtherDescription"], *updatedForm.CollabGroupOtherDescription)
		s.EqualValues(3, len(updatedForm.CollabGroups))

		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)
	})
}
