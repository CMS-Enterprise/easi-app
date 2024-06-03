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
func (suite *ResolverSuite) TestCreateTRBRequestForm() {
	ctx := suite.testConfigs.Context

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
		suite.FailNow("Unable to construct email client with local sender")
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
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err = CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)

	suite.Run("create/update/fetch TRB request forms", func() {
		// fetch the form
		fetched, err := GetTRBRequestFormByTRBRequestID(ctx, suite.testConfigs.Store, trbRequest.ID)
		suite.NoError(err)
		suite.NotNil(fetched)

		// confirm that the status is correctly marked "in progress"
		suite.EqualValues(fetched.Status, models.TRBFormStatusReadyToStart)

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
		updatedForm, err := UpdateTRBRequestForm(ctx, suite.testConfigs.Store, &emailClient, stubFetchUserInfo, formChanges)
		suite.NoError(err)
		suite.EqualValues(&anonEua, updatedForm.ModifiedBy)
		suite.EqualValues(formChanges["needsAssistanceWith"], *updatedForm.NeedsAssistanceWith)
		suite.EqualValues(formChanges["hasSolutionInMind"], *updatedForm.HasSolutionInMind)
		suite.EqualValues(formChanges["proposedSolution"], *updatedForm.ProposedSolution)
		suite.EqualValues(formChanges["whereInProcess"], *updatedForm.WhereInProcess)
		suite.EqualValues(formChanges["whereInProcessOther"], *updatedForm.WhereInProcessOther)
		suite.EqualValues(formChanges["hasExpectedStartEndDates"], *updatedForm.HasExpectedStartEndDates)

		suite.True((*updatedForm.ExpectedStartDate).Equal(expectedStartDate))
		suite.True((*updatedForm.ExpectedEndDate).Equal(expectedEndDate))

		suite.EqualValues(updatedCollabGroups[0], updatedForm.CollabGroups[0])
		suite.EqualValues(updatedCollabGroups[1], updatedForm.CollabGroups[1])
		suite.EqualValues(updatedCollabGroups[2], updatedForm.CollabGroups[2])

		suite.EqualValues(formChanges["collabDateSecurity"], *updatedForm.CollabDateSecurity)
		suite.EqualValues(formChanges["collabDateEnterpriseArchitecture"], *updatedForm.CollabDateEnterpriseArchitecture)
		suite.EqualValues(formChanges["collabDateCloud"], *updatedForm.CollabDateCloud)
		suite.EqualValues(formChanges["collabDatePrivacyAdvisor"], *updatedForm.CollabDatePrivacyAdvisor)
		suite.EqualValues(formChanges["collabDateGovernanceReviewBoard"], *updatedForm.CollabDateGovernanceReviewBoard)
		suite.EqualValues(formChanges["collabDateOther"], *updatedForm.CollabDateOther)

		suite.EqualValues(formChanges["collabGroupOther"], *updatedForm.CollabGroupOther)
		suite.EqualValues(3, len(updatedForm.CollabGroups))

		suite.EqualValues(subjectAreaOptions[0], updatedForm.SubjectAreaOptions[0])
		suite.EqualValues(subjectAreaOptions[1], updatedForm.SubjectAreaOptions[1])
		suite.EqualValues(formChanges["subjectAreaOptionOther"], *updatedForm.SubjectAreaOptionOther)

		// confirm that the status is correctly marked "in progress"
		suite.EqualValues(updatedForm.Status, models.TRBFormStatusInProgress)

		// confirm we don't yet have a submission date
		suite.Nil(updatedForm.SubmittedAt)

		submitChanges := map[string]interface{}{
			"trbRequestId": trbRequest.ID,
			"isSubmitted":  true,
		}
		submittedForm, err := UpdateTRBRequestForm(ctx, suite.testConfigs.Store, &emailClient, stubFetchUserInfo, submitChanges)
		suite.NoError(err)
		suite.EqualValues(submittedForm.Status, models.TRBFormStatusCompleted)
		suite.NotNil(submittedForm.SubmittedAt) // we submitted, so this should be populated
	})
}
