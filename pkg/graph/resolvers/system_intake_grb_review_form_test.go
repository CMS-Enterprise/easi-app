package resolvers

import (
	"time"

	"github.com/99designs/gqlgen/graphql"

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

func (s *ResolverSuite) TestSystemIntakeUpdateGrbReviewFormInputPresentationStandard() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	grbDate := time.Now().UTC()

	updatedPayload, err := UpdateSystemIntakeGRBReviewFormInputPresentationStandard(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInputPresentationStandard{
			SystemIntakeID: systemIntake.ID,
			GrbDate:        grbDate,
		},
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	s.WithinDuration(grbDate, *updatedPayload.SystemIntake.GRBDate, time.Second)
}

func (s *ResolverSuite) TestSystemIntakeUpdateGrbReviewFormInputPresentationAsync() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	timeNow := time.Now().UTC()

	updatedPayload, err := UpdateSystemIntakeGRBReviewFormInputPresentationAsync(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInputPresentationAsync{
			SystemIntakeID:              systemIntake.ID,
			GrbReviewAsyncRecordingTime: graphql.OmittableOf(&timeNow),
		},
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncRecordingTime)
	s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewAsyncRecordingTime, time.Second)
}

func (s *ResolverSuite) TestSystemIntakeUpdateSystemIntakeGRBReviewFormInputTimeframeAsync() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	timeNow := time.Now().UTC()

	updatedPayload, err := UpdateSystemIntakeGRBReviewFormInputTimeframeAsync(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync{
			SystemIntakeID:        systemIntake.ID,
			GrbReviewAsyncEndDate: timeNow,
		},
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	if s.Suite.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncEndDate) {
		s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewAsyncEndDate, time.Second)
	}

	s.Nil(updatedPayload.SystemIntake.GRBReviewStartedAt)

	tomorrowTime := timeNow.AddDate(0, 0, 1)

	startedTime := time.Now()
	updatedPayloadStarted, err := UpdateSystemIntakeGRBReviewFormInputTimeframeAsync(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync{
			SystemIntakeID:        systemIntake.ID,
			GrbReviewAsyncEndDate: tomorrowTime,
			StartGRBReview:        true,
		},
	)
	// Update the time and set the start date
	s.NoError(err)
	if s.Suite.NotNil(updatedPayloadStarted) {
		if s.Suite.NotNil(updatedPayloadStarted.SystemIntake) {
			if s.Suite.NotNil(updatedPayloadStarted.SystemIntake.GrbReviewAsyncEndDate) {
				s.WithinDuration(tomorrowTime, *updatedPayloadStarted.SystemIntake.GrbReviewAsyncEndDate, time.Second)
			}

			if s.Suite.NotNil(updatedPayloadStarted.SystemIntake.GRBReviewStartedAt) {
				s.WithinDuration(startedTime, *updatedPayloadStarted.SystemIntake.GRBReviewStartedAt, time.Second)
			}
		}
	}

	// Try to start again and assert an error
	erroredPayload, err := UpdateSystemIntakeGRBReviewFormInputTimeframeAsync(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync{
			SystemIntakeID:        systemIntake.ID,
			GrbReviewAsyncEndDate: tomorrowTime,
			StartGRBReview:        true,
		},
	)
	s.Nil(erroredPayload)
	s.Error(err)

}
