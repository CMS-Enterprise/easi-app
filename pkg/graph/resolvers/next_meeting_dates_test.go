package resolvers

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakeNextMeetingDate() {
	// Fake "now" for the whole test
	now := time.Date(2024, time.May, 8, 0, 0, 0, 0, time.UTC)
	past := helpers.PointerTo(now.Add(-time.Hour))
	future := helpers.PointerTo(now.Add(time.Hour))
	farFuture := helpers.PointerTo(now.Add(time.Hour * 2))

	// Test that the function returns nil when there are only nil dates
	fakeIntake := &models.SystemIntake{
		GRBDate: nil,
		GRTDate: nil,
	}
	s.Nil(SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test that the function returns nil when there are no dates in the future
	// grb date in past
	// grt date is nil
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: nil,
	}
	s.Nil(SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test that the function returns nil when there are no dates in the future
	// grb date is nil
	// grt date in past
	fakeIntake = &models.SystemIntake{
		GRBDate: nil,
		GRTDate: past,
	}
	s.Nil(SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test that the function returns nil when there are no dates in the future
	// both dates in past
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: past,
	}
	s.Nil(SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with a single date in the future
	// grb date in future
	// grt date is nil
	fakeIntake = &models.SystemIntake{
		GRBDate: future,
		GRTDate: nil,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with a single date in the future
	// grb date is nil
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: nil,
		GRTDate: future,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with both dates in the future (equal dates)
	// grb date in future
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: future,
		GRTDate: future,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with both dates in the future
	// grb date in future
	// grt date in far future
	fakeIntake = &models.SystemIntake{
		GRBDate: future,
		GRTDate: farFuture,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with both dates in the future
	// grb date in far future
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: farFuture,
		GRTDate: future,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with one date in past, one in future
	// grb date in far future
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: future,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))
}

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
