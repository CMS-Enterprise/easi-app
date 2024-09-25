package resolvers

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

// TestCreateTRBRequestForm tests the creation a new TRB request form
func (s *ResolverSuite) TestCreateTRBRequestForm() {
	ctx := s.testConfigs.Context
	okta := local.NewOktaAPIClient()

	config := testhelpers.NewConfig()

	// set up Email Client
	emailConfig := email.Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail: models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		TRBEmail:          models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:     models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	env, _ := appconfig.NewEnvironment("test") // hardcoding here rather than using real env vars so we can have predictable the output in our tests

	localSender := local.NewSender(env)
	emailClient, err := email.NewClient(emailConfig, localSender)
	if err != nil {
		s.FailNow("Unable to construct email client with local sender")
	}

	trbRequest := s.createNewTRBRequest()

	s.Run("create/update/fetch TRB request forms", func() {
		// fetch the form
		fetched, err := GetTRBRequestFormByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)

		// confirm that the status is correctly marked "in progress"
		s.EqualValues(fetched.Status, models.TRBFormStatusReadyToStart)

		updatedCollabGroups := []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionSecurity,
			models.TRBCollabGroupOptionCloud,
			models.TRBCollabGroupOptionPrivacyAdvisor,
		}
		expectedStartDate, _ := time.Parse(time.RFC3339, "2022-10-10T12:00:00+00:00")
		expectedEndDate, _ := time.Parse(time.RFC3339, "2050-10-10T12:00:00+00:00")

		subjectAreaOptions := []models.TRBSubjectAreaOption{
			models.TRBSubjectAreaOptionAccessControlAndIdentityMgmt,
			models.TRBSubjectAreaOptionCloudMigration,
		}

		formChanges := map[string]interface{}{
			"isSubmitted":                      false,
			"trbRequestId":                     trbRequest.ID,
			"component":                        "Taco Cart",
			"needsAssistanceWith":              "Some of the things",
			"hasSolutionInMind":                true,
			"proposedSolution":                 "Tinder, but for cats",
			"whereInProcess":                   models.TRBWhereInProcessOptionContractingWorkHasStarted,
			"whereInProcessOther":              "Fixing Wifi",
			"hasExpectedStartEndDates":         true,
			"expectedStartDate":                expectedStartDate,
			"expectedEndDate":                  expectedEndDate,
			"collabGroups":                     updatedCollabGroups,
			"collabDateSecurity":               "2021-10-20",
			"collabDateEnterpriseArchitecture": "2021-10-21",
			"collabDateCloud":                  "2021-10-22",
			"collabDatePrivacyAdvisor":         "2021-10-23",
			"collabDateGovernanceReviewBoard":  "2021-10-24",
			"collabDateOther":                  "2021-10-25",
			"collabGroupOther":                 "Geek Squad",
			"subjectAreaOptions":               subjectAreaOptions,
			"subjectAreaOptionOther":           "Some other technical topic",
		}
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, &emailClient, okta.FetchUserInfo, formChanges)
		s.NoError(err)
		s.EqualValues(s.testConfigs.Principal.EUAID, *updatedForm.ModifiedBy)
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

		s.EqualValues(formChanges["collabDateSecurity"], *updatedForm.CollabDateSecurity)
		s.EqualValues(formChanges["collabDateEnterpriseArchitecture"], *updatedForm.CollabDateEnterpriseArchitecture)
		s.EqualValues(formChanges["collabDateCloud"], *updatedForm.CollabDateCloud)
		s.EqualValues(formChanges["collabDatePrivacyAdvisor"], *updatedForm.CollabDatePrivacyAdvisor)
		s.EqualValues(formChanges["collabDateGovernanceReviewBoard"], *updatedForm.CollabDateGovernanceReviewBoard)
		s.EqualValues(formChanges["collabDateOther"], *updatedForm.CollabDateOther)

		s.EqualValues(formChanges["collabGroupOther"], *updatedForm.CollabGroupOther)
		s.EqualValues(3, len(updatedForm.CollabGroups))

		s.EqualValues(subjectAreaOptions[0], updatedForm.SubjectAreaOptions[0])
		s.EqualValues(subjectAreaOptions[1], updatedForm.SubjectAreaOptions[1])
		s.EqualValues(formChanges["subjectAreaOptionOther"], *updatedForm.SubjectAreaOptionOther)

		// confirm that the status is correctly marked "in progress"
		s.EqualValues(updatedForm.Status, models.TRBFormStatusInProgress)

		// confirm we don't yet have a submission date
		s.Nil(updatedForm.SubmittedAt)

		submitChanges := map[string]interface{}{
			"trbRequestId": trbRequest.ID,
			"isSubmitted":  true,
		}
		submittedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, &emailClient, okta.FetchUserInfo, submitChanges)
		s.NoError(err)
		s.EqualValues(submittedForm.Status, models.TRBFormStatusCompleted)
		s.NotNil(submittedForm.SubmittedAt) // we submitted, so this should be populated
	})
}
