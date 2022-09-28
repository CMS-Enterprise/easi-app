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

	s.Run("create/update/fetch TRB request attendees", func() {
		attendee := models.TRBRequestAttendee{
			EUAUserID:    anonEua,
			TRBRequestID: trbRequest.ID,
			Role:         models.PersonRolePrivacyAdvisor,
		}
		attendee.CreatedBy = anonEua
		createdAttendee, err := CreateTRBRequestAttendee(ctx, s.testConfigs.Store, &attendee)
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
