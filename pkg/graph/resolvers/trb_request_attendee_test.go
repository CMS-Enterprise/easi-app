package resolvers

import (
	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

// TestCreateTRBRequestAttendee makes a new TRB request
func (s *ResolverSuite) TestTRBRequestAttendee() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
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
	localSender := local.NewSender()
	emailClient, err := email.NewClient(emailConfig, localSender)
	s.NoError(err)

	trbRequest := s.createNewTRBRequest()
	s.NoError(err)

	s.Run("fetches TRB request attendees (default attendee should exist)", func() {
		fetched, err := GetTRBRequestAttendeesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) == 1)
	})

	s.Run("create/update/fetch TRB request attendees", func() {
		paRole := models.PersonRolePrivacyAdvisor
		cnRole := models.PersonRoleCloudNavigator
		attendee := models.TRBRequestAttendee{
			EUAUserID:    "ABCD",
			TRBRequestID: trbRequest.ID,
			Role:         &paRole,
		}
		createdAttendee, err := CreateTRBRequestAttendee(
			ctx,
			store,
			emailClient.SendTRBAttendeeAddedNotification,
			okta.FetchUserInfo,
			&attendee,
		)
		s.NoError(err)
		s.EqualValues(s.testConfigs.Principal.EUAID, createdAttendee.CreatedBy)

		createdAttendee.Role = &cnRole
		updatedAttendee, err := UpdateTRBRequestAttendee(ctx, store, createdAttendee)
		s.NoError(err)
		s.EqualValues(cnRole, *updatedAttendee.Role)
		s.EqualValues(s.testConfigs.Principal.EUAID, *updatedAttendee.ModifiedBy)

		component := "The Citadel of Ricks"
		createdAttendee.Component = &component
		updatedAttendee, err = UpdateTRBRequestAttendee(ctx, store, createdAttendee)
		s.NoError(err)
		s.EqualValues(component, *updatedAttendee.Component)
		s.EqualValues(s.testConfigs.Principal.EUAID, *updatedAttendee.ModifiedBy)
	})

	s.Run("fetches TRB request attendees", func() {
		fetched, err := GetTRBRequestAttendeesByTRBRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) == 2) // Default attendee, plus the one we created in the previous test!
	})
	s.Run("Get requester component", func() {
		trbRequest := s.createNewTRBRequest()
		component := "Jedi Council"
		role := models.PersonRoleProductOwner
		requesterAttendee, err := store.GetAttendeeByEUAIDAndTRBID(ctx, s.testConfigs.Principal.EUAID, trbRequest.ID)
		s.NoError(err)
		requesterAttendee.Component = &component
		requesterAttendee.Role = &role
		updatedAttendee, err := UpdateTRBRequestAttendee(ctx, store, requesterAttendee)
		s.NoError(err)
		s.NotNil(updatedAttendee)
		s.NotNil(updatedAttendee.Component)
		s.Equal(component, *updatedAttendee.Component)
		s.NotNil(updatedAttendee.Role)
		s.Equal(role, *updatedAttendee.Role)
		fetchedRequesterComponent, err := GetTRBAttendeeComponent(s.ctxWithNewDataloaders(), &s.testConfigs.Principal.EUAID, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetchedRequesterComponent)
		s.Equal(component, *fetchedRequesterComponent)
	})
}
