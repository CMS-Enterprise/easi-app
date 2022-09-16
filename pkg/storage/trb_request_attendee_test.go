package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestCreateTRBRequestAttendee() {
	ctx := context.Background()
	logger := appcontext.ZLogger(ctx)
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	_, err := s.store.CreateTRBRequest(s.logger, trbRequest)
	s.NoError(err)

	s.Run("create a TRB request attendee", func() {
		attendee := models.TRBRequestAttendee{
			EUAUserID:    anonEua,
			TRBRequestID: trbRequest.ID,
		}
		attendee.CreatedBy = anonEua
		createdAttendee, err := s.store.CreateTRBRequestAttendee(ctx, &attendee)
		s.NoError(err)

		createdAttendee.Role = "Evil Morty"
		createdAttendee.ModifiedBy = &anonEua
		_, err = s.store.UpdateTRBRequestAttendee(ctx, createdAttendee)
		s.NoError(err)

		createdAttendee.Component = "The Citadel of Ricks"
		createdAttendee.ModifiedBy = &anonEua
		_, err = s.store.UpdateTRBRequestAttendee(ctx, createdAttendee)
		s.NoError(err)
	})

	s.Run("fetches TRB request attendees", func() {
		fetched, err := s.store.GetTRBRequestAttendeesByTRBRequestID(logger, trbRequest.ID)
		s.NoError(err)
		s.True(len(fetched) > 0)
	})
}
