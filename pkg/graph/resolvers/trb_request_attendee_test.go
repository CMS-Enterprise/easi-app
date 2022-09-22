package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequestAttendee makes a new TRB request
func (s *ResolverSuite) TestCreateTRBRequestAttendee() {
	ctx := context.Background()
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("create a TRB request attendee", func() {
		attendee := models.TRBRequestAttendee{
			EUAUserID:    anonEua,
			TRBRequestID: trbRequest.ID,
			Role:         models.PersonRolePrivacyAdvisor,
		}
		attendee.CreatedBy = anonEua
		createdAttendee, err := s.testConfigs.Store.CreateTRBRequestAttendee(ctx, &attendee)
		s.NoError(err)

		createdAttendee.Role = models.PersonRoleCloudNavigator
		createdAttendee.ModifiedBy = &anonEua
		_, err = s.testConfigs.Store.UpdateTRBRequestAttendee(ctx, createdAttendee)
		s.NoError(err)

		createdAttendee.Component = "The Citadel of Ricks"
		createdAttendee.ModifiedBy = &anonEua
		_, err = s.testConfigs.Store.UpdateTRBRequestAttendee(ctx, createdAttendee)
		s.NoError(err)
	})

	s.Run("fetches TRB request attendees", func() {
		fetched, err := s.testConfigs.Store.GetTRBRequestAttendeesByTRBRequestID(ctx, trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
