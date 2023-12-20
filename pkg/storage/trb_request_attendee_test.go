package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestCreateTRBRequestAttendee() {
	ctx := context.Background()
	anonEua := "ANON"
	anonPrinc := s.Principal
	trbRequest := models.NewTRBRequest(anonPrinc.UserAccount.ID)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	_, err := s.store.CreateTRBRequest(ctx, anonPrinc, trbRequest)
	s.NoError(err)

	s.Run("create a TRB request attendee", func() {
		poRole := models.PersonRoleProductOwner
		cnRole := models.PersonRoleCloudNavigator
		attendee := models.TRBRequestAttendee{
			EUAUserID:    anonEua,
			TRBRequestID: trbRequest.ID,
			Role:         &poRole,
		}
		attendee.CreatedBy = anonEua
		createdAttendee, err := s.store.CreateTRBRequestAttendee(ctx, &attendee)
		s.NoError(err)

		createdAttendee.Role = &cnRole
		createdAttendee.ModifiedBy = &anonEua
		_, err = s.store.UpdateTRBRequestAttendee(ctx, createdAttendee)
		s.NoError(err)

		component := "The Citadel of Ricks"
		createdAttendee.Component = &component
		createdAttendee.ModifiedBy = &anonEua
		_, err = s.store.UpdateTRBRequestAttendee(ctx, createdAttendee)
		s.NoError(err)
	})

	s.Run("fetches TRB request attendees", func() {
		fetched, err := s.store.GetTRBRequestAttendeesByTRBRequestID(ctx, trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
