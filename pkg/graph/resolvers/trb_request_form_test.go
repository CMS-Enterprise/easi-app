package resolvers

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

// TestCreateTRBRequestForm tests the creation a new TRB request form
func (s *ResolverSuite) TestCreateTRBRequestForm() {
	ctx := context.Background()

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
	localSender := local.NewSender()
	emailClient, err := email.NewClient(emailConfig, localSender)
	if err != nil {
		s.FailNow("Unable to construct email client with local sender")
	}

	anonEua := "ANON"

	stubFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    anonEua,
			DisplayName: "Anonymous",
			Email:       models.NewEmailAddress("anon@local.fake"),
		}, nil
	}

	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBRequestTypeNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err = CreateTRBRequest(s.testConfigs.Context, models.TRBRequestTypeBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("create/update/fetch TRB request forms", func() {
		// fetch the form
		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
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
			models.TRBSubjectAreaOptionAccessControlAndIDEntityManagement,
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
		updatedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, &emailClient, stubFetchUserInfo, formChanges)
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
		submittedForm, err := UpdateTRBRequestForm(ctx, s.testConfigs.Store, &emailClient, stubFetchUserInfo, submitChanges)
		s.NoError(err)
		s.EqualValues(submittedForm.Status, models.TRBFormStatusCompleted)
		s.NotNil(submittedForm.SubmittedAt) // we submitted, so this should be populated
	})
}
