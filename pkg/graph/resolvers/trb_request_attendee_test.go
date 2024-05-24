package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

// TestCreateTRBRequestAttendee makes a new TRB request
func (suite *ResolverSuite) TestCreateTRBRequestAttendee() {
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

	suite.Run("fetches TRB request attendees (default attendee should exist)", func() {
		fetched, err := GetTRBRequestAttendeesByTRBRequestID(ctx, suite.testConfigs.Store, trbRequest.ID)
		suite.NoError(err)
		suite.True(len(fetched) == 1)
	})

	suite.Run("create/update/fetch TRB request attendees", func() {
		paRole := models.PersonRolePrivacyAdvisor
		cnRole := models.PersonRoleCloudNavigator
		attendee := models.TRBRequestAttendee{
			EUAUserID:    "ABCD", // not ANON, since that's created by default from s.fetchUserInfoStub
			TRBRequestID: trbRequest.ID,
			Role:         &paRole,
		}
		attendee.CreatedBy = anonEua
		createdAttendee, err := CreateTRBRequestAttendee(
			ctx,
			suite.testConfigs.Store,
			emailClient.SendTRBAttendeeAddedNotification,
			stubFetchUserInfo,
			&attendee,
		)
		suite.NoError(err)

		createdAttendee.Role = &cnRole
		createdAttendee.ModifiedBy = &anonEua
		updatedAttendee, err := UpdateTRBRequestAttendee(ctx, suite.testConfigs.Store, createdAttendee)
		suite.NoError(err)
		suite.EqualValues(*updatedAttendee.Role, models.PersonRoleCloudNavigator)
		suite.EqualValues(updatedAttendee.ModifiedBy, &anonEua)

		component := "The Citadel of Ricks"
		createdAttendee.Component = &component
		createdAttendee.ModifiedBy = &anonEua
		updatedAttendee, err = UpdateTRBRequestAttendee(ctx, suite.testConfigs.Store, createdAttendee)
		suite.NoError(err)
		suite.EqualValues(*updatedAttendee.Component, "The Citadel of Ricks")
		suite.EqualValues(updatedAttendee.ModifiedBy, &anonEua)
	})

	suite.Run("fetches TRB request attendees", func() {
		fetched, err := GetTRBRequestAttendeesByTRBRequestID(ctx, suite.testConfigs.Store, trbRequest.ID)
		suite.NoError(err)
		suite.True(len(fetched) == 2) // Default attendee, plus the one we created in the previous test!
	})
}
