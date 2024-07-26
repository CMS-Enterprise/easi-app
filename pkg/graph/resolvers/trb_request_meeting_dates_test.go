package resolvers

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestTRBRequestNextMeetingDate() {
	// Fake "now" for the whole test
	now := time.Date(2024, time.May, 8, 0, 0, 0, 0, time.UTC)
	past := helpers.PointerTo(now.Add(-time.Hour))
	future := helpers.PointerTo(now.Add(time.Hour))
	// Test that the function returns nil when the consult meeting time is nil
	fakeTRBRequest := &models.TRBRequest{
		ConsultMeetingTime: nil,
	}
	s.Nil(TRBRequestNextMeetingDate(s.testConfigs.Context, fakeTRBRequest, now))

	// Test that the function returns nil when the consult meeting time is in the past
	fakeTRBRequest = &models.TRBRequest{
		ConsultMeetingTime: past,
	}
	s.Nil(TRBRequestNextMeetingDate(s.testConfigs.Context, fakeTRBRequest, now))

	// Test that the function returns the correct date when the consult meeting time is in the future
	fakeTRBRequest = &models.TRBRequest{
		ConsultMeetingTime: future,
	}
	s.Equal(future, TRBRequestNextMeetingDate(s.testConfigs.Context, fakeTRBRequest, now))
}

func (s *ResolverSuite) TestTRBRequestLastMeetingDate() {
	// Fake "now" for the whole test
	now := time.Date(2024, time.May, 8, 0, 0, 0, 0, time.UTC)
	past := helpers.PointerTo(now.Add(-time.Hour))
	future := helpers.PointerTo(now.Add(time.Hour))
	// Test that the function returns nil when the consult meeting time is nil
	fakeTRBRequest := &models.TRBRequest{
		ConsultMeetingTime: nil,
	}
	s.Nil(TRBRequestLastMeetingDate(s.testConfigs.Context, fakeTRBRequest, now))

	// Test that the function returns the correct date when the consult meeting time is in the past
	fakeTRBRequest = &models.TRBRequest{
		ConsultMeetingTime: past,
	}
	s.Equal(past, TRBRequestLastMeetingDate(s.testConfigs.Context, fakeTRBRequest, now))

	// Test that the function returns nil when the consult meeting time is in the future
	fakeTRBRequest = &models.TRBRequest{
		ConsultMeetingTime: future,
	}
	s.Nil(TRBRequestLastMeetingDate(s.testConfigs.Context, fakeTRBRequest, now))
}
