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
func (s *ResolverSuite) TestCreateTRBRequestAttendee() {
	ctx := context.Background()

	config := testhelpers.NewConfig()

	// set up Email Client
	emailConfig := email.Config{
		GRTEmail:               models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail:      models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		AccessibilityTeamEmail: models.NewEmailAddress(config.GetString(appconfig.AccessibilityTeamEmailKey)),
		TRBEmail:               models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:          models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:                config.GetString(appconfig.ClientHostKey),
		URLScheme:              config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory:      config.GetString(appconfig.EmailTemplateDirectoryKey),
	}
	localSender := local.NewSender()
	emailClient, err := email.NewClient(emailConfig, localSender)
	if err != nil {
		s.FailNow("Unable to construct email client with local sender")
	}

	anonEua := "ANON"

	stubFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			EuaUserID:  anonEua,
			CommonName: "Anonymous",
			Email:      models.NewEmailAddress("anon@local.fake"),
		}, nil
	}

	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	trbRequest, err = CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("create/update/fetch TRB request attendees", func() {
		attendee := models.TRBRequestAttendee{
			EUAUserID:    anonEua,
			TRBRequestID: trbRequest.ID,
			Role:         models.PersonRolePrivacyAdvisor,
		}
		attendee.CreatedBy = anonEua
		createdAttendee, err := CreateTRBRequestAttendee(
			ctx,
			s.testConfigs.Store,
			&emailClient,
			stubFetchUserInfo,
			&attendee,
		)
		s.NoError(err)

		createdAttendee.Role = models.PersonRoleCloudNavigator
		createdAttendee.ModifiedBy = &anonEua
		updatedAttendee, err := UpdateTRBRequestAttendee(ctx, s.testConfigs.Store, createdAttendee)
		s.NoError(err)
		s.EqualValues(updatedAttendee.Role, models.PersonRoleCloudNavigator)
		s.EqualValues(updatedAttendee.ModifiedBy, &anonEua)

		createdAttendee.Component = "The Citadel of Ricks"
		createdAttendee.ModifiedBy = &anonEua
		updatedAttendee, err = UpdateTRBRequestAttendee(ctx, s.testConfigs.Store, createdAttendee)
		s.NoError(err)
		s.EqualValues(updatedAttendee.Component, "The Citadel of Ricks")
		s.EqualValues(updatedAttendee.ModifiedBy, &anonEua)
	})

	s.Run("fetches TRB request attendees", func() {
		fetched, err := GetTRBRequestAttendeesByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) == 1)
	})
}
