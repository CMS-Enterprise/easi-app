package resolvers

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"

	"github.com/99designs/gqlgen/graphql"

	"github.com/google/uuid"

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

func (s *ResolverSuite) TestCalcSystemIntakeGRBReviewAsyncStatus() {
	now := time.Now()
	futureTime := now.Add(24 * time.Hour) // 24 hours in the future
	pastTime := now.Add(-24 * time.Hour)  // 24 hours in the past
	systemIntakeID := uuid.New()

	tests := []struct {
		name     string
		intake   models.SystemIntake
		expected *models.SystemIntakeGRBReviewAsyncStatusType
	}{
		{
			name: "Error - GRB Review Async end date is not set",
			intake: models.SystemIntake{
				ID:            systemIntakeID,
				GrbReviewType: models.SystemIntakeGRBReviewTypeAsync,
			},
			expected: nil,
		},
		{
			name: "Status - In Progress (End date is in the future)",
			intake: models.SystemIntake{
				ID:                    systemIntakeID,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: &futureTime,
			},
			expected: helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress),
		},
		{
			name: "Status - Completed (End date is in the past)",
			intake: models.SystemIntake{
				ID:                    systemIntakeID,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: &pastTime,
			},
			expected: helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted),
		},
	}

	for _, tc := range tests {
		s.Run(tc.name, func() {
			status := CalcSystemIntakeGRBReviewAsyncStatus(&tc.intake)

			if tc.expected == nil {
				s.Nil(status)
			} else {
				// No errors expected
				s.NotNil(status)
				s.Equal(*tc.expected, *status)
			}
		})
	}
}

func (s *ResolverSuite) TestManuallyEndSystemIntakeGRBReviewAsyncVoting() {
	systemIntake := s.createNewIntake()
	s.NotNil(systemIntake)

	// Set the intake to async
	systemIntake.GrbReviewType = models.SystemIntakeGRBReviewTypeAsync

	// Set the end date to one hour in the future
	oneHourLater := time.Now().Add(time.Hour)
	systemIntake.GrbReviewAsyncEndDate = &oneHourLater

	// Update the intake
	_, err := s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, systemIntake)
	s.NoError(err)

	// Calculate the status
	status := CalcSystemIntakeGRBReviewAsyncStatus(systemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress, *status)

	// End the voting
	updatedPayload, err := ManuallyEndSystemIntakeGRBReviewAsyncVoting(
		s.testConfigs.Context,
		s.testConfigs.Store,
		systemIntake.ID,
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	// Check the manual end date
	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncManualEndDate)
	s.WithinDuration(time.Now(), *updatedPayload.SystemIntake.GrbReviewAsyncManualEndDate, time.Second)

	// Calculate the status again
	status = CalcSystemIntakeGRBReviewAsyncStatus(updatedPayload.SystemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted, *status)
}
