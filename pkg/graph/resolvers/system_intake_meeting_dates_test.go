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
	// grb date in past
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: future,
	}
	s.EqualValues(future, SystemIntakeNextMeetingDate(s.testConfigs.Context, fakeIntake, now))
}

func (s *ResolverSuite) TestSystemIntakeLastMeetingDate() {
	// Fake "now" for the whole test
	now := time.Date(2024, time.May, 8, 0, 0, 0, 0, time.UTC)
	past := helpers.PointerTo(now.Add(-time.Hour))
	farPast := helpers.PointerTo(now.Add(-time.Hour * 2))
	future := helpers.PointerTo(now.Add(time.Hour))

	// Test that the function returns nil when there are only nil dates
	fakeIntake := &models.SystemIntake{
		GRBDate: nil,
		GRTDate: nil,
	}
	s.Nil(SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test that the function returns nil when there are no dates in the past
	// grb date in future
	// grt date is nil
	fakeIntake = &models.SystemIntake{
		GRBDate: future,
		GRTDate: nil,
	}
	s.Nil(SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test that the function returns nil when there are no dates in the past
	// grb date is nil
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: nil,
		GRTDate: future,
	}
	s.Nil(SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test that the function returns nil when there are no dates in the past
	// both dates in future
	fakeIntake = &models.SystemIntake{
		GRBDate: future,
		GRTDate: future,
	}
	s.Nil(SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with a single date in the past
	// grb date in past
	// grt date is nil
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: nil,
	}
	s.EqualValues(past, SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with a single date in the past
	// grb date is nil
	// grt date in past
	fakeIntake = &models.SystemIntake{
		GRBDate: nil,
		GRTDate: past,
	}
	s.EqualValues(past, SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with both dates in the past (equal dates)
	// grb date in past
	// grt date in past
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: past,
	}
	s.EqualValues(past, SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with both dates in the past
	// grb date in past
	// grt date in far past
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: farPast,
	}
	s.EqualValues(past, SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with both dates in the past
	// grb date in far past
	// grt date in past
	fakeIntake = &models.SystemIntake{
		GRBDate: farPast,
		GRTDate: past,
	}
	s.EqualValues(past, SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))

	// Test with one date in past, one in future
	// grb date in past
	// grt date in future
	fakeIntake = &models.SystemIntake{
		GRBDate: past,
		GRTDate: future,
	}
	s.EqualValues(past, SystemIntakeLastMeetingDate(s.testConfigs.Context, fakeIntake, now))
}
