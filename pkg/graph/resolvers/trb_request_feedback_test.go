package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequestFeedback makes a new TRB request feedback
func (s *ResolverSuite) TestCreateTRBRequestFeedback() {
	ctx := context.Background()
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("create/update/fetch TRB request forms", func() {
		// fetch the form
		fetched, err := GetTRBRequestFeedbackByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)

		// // confirm that the status is correctly marked "in progress"
		// s.EqualValues(fetched.Status, models.TRBFormStatusReadyToStart)

		// formChanges := map[string]interface{}{
		// 	"isSubmitted":                               false,
		// 	"trbRequestId":                              trbRequest.ID.String(),
		// 	"component":                                 "Taco Cart",
		// 	"needsAssistanceWith":                       "Some of the things",
		// 	"hasSolutionInMind":                         true,
		// 	"proposedSolution":                          "Tinder, but for cats",
		// 	"whereInProcess":                            models.TRBWhereInProcessOptionContractingWorkHasStarted,
		// 	"whereInProcessOther":                       "Fixing Wifi",
		// 	"hasExpectedStartEndDates":                  true,
		// 	"expectedStartDate":                         expectedStartDate,
		// 	"expectedEndDate":                           expectedEndDate,
		// 	"collabGroups":                              updatedCollabGroups,
		// 	"collabDateSecurity":                        "2021-10-20",
		// 	"collabDateEnterpriseArchitecture":          "2021-10-21",
		// 	"collabDateCloud":                           "2021-10-22",
		// 	"collabDatePrivacyAdvisor":                  "2021-10-23",
		// 	"collabDateGovernanceReviewBoard":           "2021-10-24",
		// 	"collabDateOther":                           "2021-10-25",
		// 	"collabGroupOther":                          "Geek Squad",
		// 	"subjectAreaTechnicalReferenceArchitecture": subjectAreaTechnicalReferenceArchitecture,
		// 	"subjectAreaNetworkAndSecurity":             subjectAreaNetworkAndSecurity,
		// 	"subjectAreaCloudAndInfrastructure":         subjectAreaCloudAndInfrastructure,
		// 	"subjectAreaApplicationDevelopment":         subjectAreaApplicationDevelopment,
		// 	"subjectAreaDataAndDataManagement":          subjectAreaDataAndDataManagement,
		// 	"subjectAreaGovernmentProcessesAndPolicies": subjectAreaGovernmentProcessesAndPolicies,
		// 	"subjectAreaOtherTechnicalTopics":           subjectAreaOtherTechnicalTopics,
		// }

		// submitChanges := map[string]interface{}{
		// 	"trbRequestId": trbRequest.ID.String(),
		// 	"isSubmitted":  true,
		// }
		// s.NoError(err)
		// s.EqualValues(submittedForm.Status, models.TRBFormStatusCompleted)
	})
}
