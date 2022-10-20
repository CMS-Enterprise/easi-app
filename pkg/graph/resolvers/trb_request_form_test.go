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
		// fetch the form
		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)

		// confirm that the status is correctly marked "in progress"
		s.True(fetched.Status == models.TRBFormStatusReadyToStart)

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
			"isSubmitted":                               false,
			"trbRequestId":                              trbRequest.ID.String(),
			"component":                                 "Taco Cart",
			"needsAssistanceWith":                       "Some of the things",
			"hasSolutionInMind":                         true,
			"proposedSolution":                          "Tinder, but for cats",
			"whereInProcess":                            models.TRBWhereInProcessOptionContractingWorkHasStarted,
			"whereInProcessOther":                       "Fixing Wifi",
			"hasExpectedStartEndDates":                  true,
			"expectedStartDate":                         expectedStartDate,
			"expectedEndDate":                           expectedEndDate,
			"collabGroups":                              updatedCollabGroups,
			"collabDateSecurity":                        collabDateSecurity,
			"collabDateEnterpriseArchitecture":          collabDateEnterpriseArchitecture,
			"collabDateCloud":                           collabDateCloud,
			"collabDatePrivacyAdvisor":                  collabDatePrivacyAdvisor,
			"collabDateGovernanceReviewBoard":           collabDateGovernanceReviewBoard,
			"collabDateOther":                           collabDateOther,
			"collabGroupOther":                          "Geek Squad",
			"subjectAreaTechnicalReferenceArchitecture": models.TRBTechnicalReferenceArchitectureOptionArchitectureChangeRequestProcessForTheTra,
			"subjectAreaNetworkAndSecurity":             models.TRBNetworkAndSecurityOptionCmsCybersecurityIntegrationCenterIntegration,
			"subjectAreaCloudAndInfrastructure":         models.TRBCloudAndInfrastructureOptionCloudIaasAndPaasInfrastructure,
			"subjectAreaApplicationDevelopment":         models.TRBApplicationDevelopmentOptionAccessibilityCompliance,
			"subjectAreaDataAndDataManagement":          models.TRBDataAndDataManagementOptionApisAndDataExchanges,
			"subjectAreaGovernmentProcessesAndPolicies": models.TRBGovernmentProcessesAndPoliciesOptionSecurityAssessments,
			"subjectAreaOtherTechnicalTopics":           models.TRBOtherTechnicalTopicsOptionArtificialIntelligence,
		}
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, formChanges)
		s.NoError(err)
		s.EqualValues(&anonEua, updatedForm.ModifiedBy)
		s.EqualValues(formChanges["needsAssistanceWith"], *updatedForm.NeedsAssistanceWith)
		s.EqualValues(formChanges["hasSolutionInMind"], *updatedForm.HasSolutionInMind)
		s.EqualValues(formChanges["proposedSolution"], *updatedForm.ProposedSolution)
		s.EqualValues(formChanges["whereInProcess"], *updatedForm.WhereInProcess)
		s.EqualValues(formChanges["whereInProcessOther"], *updatedForm.WhereInProcessOther)
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
		s.EqualValues(formChanges["collabGroupOther"], *updatedForm.CollabGroupOther)
		s.EqualValues(3, len(updatedForm.CollabGroups))
		s.EqualValues(formChanges["subjectAreaTechnicalReferenceArchitecture"], *updatedForm.SubjectAreaTechnicalReferenceArchitecture)
		s.EqualValues(formChanges["subjectAreaNetworkAndSecurity"], *updatedForm.SubjectAreaNetworkAndSecurity)
		s.EqualValues(formChanges["subjectAreaCloudAndInfrastructure"], *updatedForm.SubjectAreaCloudAndInfrastructure)
		s.EqualValues(formChanges["subjectAreaApplicationDevelopment"], *updatedForm.SubjectAreaApplicationDevelopment)
		s.EqualValues(formChanges["subjectAreaDataAndDataManagement"], *updatedForm.SubjectAreaDataAndDataManagement)
		s.EqualValues(formChanges["subjectAreaGovernmentProcessesAndPolicies"], *updatedForm.SubjectAreaGovernmentProcessesAndPolicies)
		s.EqualValues(formChanges["subjectAreaOtherTechnicalTopics"], *updatedForm.SubjectAreaOtherTechnicalTopics)

		// confirm that the status is correctly marked "in progress"
		s.True(updatedForm.Status == models.TRBFormStatusInProgress)

		submitChanges := map[string]interface{}{
			"trbRequestId": trbRequest.ID.String(),
			"isSubmitted":  true,
		}
		submittedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, submitChanges)
		s.NoError(err)
		s.True(submittedForm.Status == models.TRBFormStatusCompleted)
	})
}
