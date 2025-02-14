package resolvers

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakeUpdateGrbReviewType() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	s.Equal(
		models.SystemIntakeGRBReviewTypeStandard,
		systemIntake.GrbReviewType,
	)

	updateGrbReviewTypeInput := models.UpdateSystemIntakeGRBReviewTypeInput{
		SystemIntakeID: systemIntake.ID,
		GrbReviewType:  models.SystemIntakeGRBReviewTypeAsync,
	}

	updatedPayload, err := UpdateSystemIntakeGRBReviewType(
		s.testConfigs.Context,
		s.testConfigs.Store,
		updateGrbReviewTypeInput,
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	s.Equal(
		models.SystemIntakeGRBReviewTypeAsync,
		updatedPayload.SystemIntake.GrbReviewType,
	)
}

func (s *ResolverSuite) TestSystemIntakeUpdateGrbReviewForm() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	grbReviewType := models.SystemIntakeGRBReviewTypeAsync
	timeNow := time.Now().UTC()

	updatedPayload, err := UpdateSystemIntakeGRBReviewForm(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInput{
			SystemIntakeID:                  systemIntake.ID,
			GrbReviewType:                   &grbReviewType,
			GrbReviewAsyncRecordingTime:     &timeNow,
			GrbReviewAsyncEndDate:           &timeNow,
			GrbReviewStandardGRBMeetingTime: &timeNow,
			GrbReviewAsyncGRBMeetingTime:    &timeNow,
		},
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	s.Equal(grbReviewType, updatedPayload.SystemIntake.GrbReviewType)
	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncRecordingTime)
	s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewAsyncRecordingTime, time.Millisecond)
	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncEndDate)
	s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewAsyncEndDate, time.Millisecond)
	s.NotNil(updatedPayload.SystemIntake.GrbReviewStandardGRBMeetingTime)
	s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewStandardGRBMeetingTime, time.Millisecond)
	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncGRBMeetingTime)
	s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewAsyncGRBMeetingTime, time.Millisecond)
}
