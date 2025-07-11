package resolvers

import (
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
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
			GrbDate:        graphql.OmittableOf(&grbDate),
		},
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)
	s.NotNil(updatedPayload.SystemIntake.GRBDate)

	s.WithinDuration(grbDate, *updatedPayload.SystemIntake.GRBDate, time.Second)

	updatedPayload, err = UpdateSystemIntakeGRBReviewFormInputPresentationStandard(
		s.testConfigs.Context,
		s.testConfigs.Store,
		models.UpdateSystemIntakeGRBReviewFormInputPresentationStandard{
			SystemIntakeID: systemIntake.ID,
			GrbDate:        graphql.OmittableOf[*time.Time](nil),
		},
	)
	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)
	// confirm that you can't clear out the time if you pass in nil for the omittable
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
		s.testConfigs.EmailClient,
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
		s.testConfigs.EmailClient,
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
		s.testConfigs.EmailClient,
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
	ctx := s.ctxWithNewDataloaders()

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
			name: "Status - Past Due (End date is in the past, no quorum)",
			intake: models.SystemIntake{
				ID:                    systemIntakeID,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: &pastTime,
			},
			expected: helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypePastDue),
		},
	}

	for _, tc := range tests {
		s.Run(tc.name, func() {
			status := CalcSystemIntakeGRBReviewAsyncStatus(ctx, &tc.intake)

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

func (s *ResolverSuite) TestCalcSystemIntakeGRBReviewStandardStatus() {
	now := time.Now()
	futureTime := now.Add(24 * time.Hour) // 24 hours in the future
	pastTime := now.Add(-24 * time.Hour)  // 24 hours in the past
	systemIntakeID := uuid.New()

	tests := []struct {
		name     string
		intake   models.SystemIntake
		expected *models.SystemIntakeGRBReviewStandardStatusType
	}{
		{
			name: "Error - GRB Review type is not standard",
			intake: models.SystemIntake{
				ID:            systemIntakeID,
				GrbReviewType: models.SystemIntakeGRBReviewTypeAsync,
				GRBDate:       &now,
			},
			expected: nil,
		},
		{
			name: "Error - GRB Review date is not set",
			intake: models.SystemIntake{
				ID:            systemIntakeID,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expected: nil,
		},
		{
			name: "Status - Scheduled (GRB date is in the future)",
			intake: models.SystemIntake{
				ID:            systemIntakeID,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &futureTime,
			},
			expected: helpers.PointerTo(models.SystemIntakeGRBReviewStandardStatusTypeScheduled),
		},
		{
			name: "Status - Completed (GRB date is in the past)",
			intake: models.SystemIntake{
				ID:            systemIntakeID,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &pastTime,
			},
			expected: helpers.PointerTo(models.SystemIntakeGRBReviewStandardStatusTypeCompleted),
		},
	}

	for _, tc := range tests {
		s.Run(tc.name, func() {
			status := CalcSystemIntakeGRBReviewStandardStatus(&tc.intake)

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
	ctx := s.testConfigs.Context

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
	status := CalcSystemIntakeGRBReviewAsyncStatus(ctx, systemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress, *status)

	// End the voting
	updatedPayload, err := ManuallyEndSystemIntakeGRBReviewAsyncVoting(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
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
	status = CalcSystemIntakeGRBReviewAsyncStatus(ctx, updatedPayload.SystemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted, *status)
}

func (s *ResolverSuite) TestExtendGRBReviewDeadlineAsync() {
	ctx := s.testConfigs.Context

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
	status := CalcSystemIntakeGRBReviewAsyncStatus(ctx, systemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress, *status)

	// Extend the deadline by 2 hours
	twoHoursLater := time.Now().Add(2 * time.Hour)
	updatedPayload, err := ExtendGRBReviewDeadlineAsync(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
		models.ExtendGRBReviewDeadlineInput{
			SystemIntakeID:        systemIntake.ID,
			GrbReviewAsyncEndDate: twoHoursLater,
		},
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	// Check the new end date
	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncEndDate)
	s.WithinDuration(twoHoursLater, *updatedPayload.SystemIntake.GrbReviewAsyncEndDate, time.Second)

	// Calculate the status again
	status = CalcSystemIntakeGRBReviewAsyncStatus(ctx, updatedPayload.SystemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress, *status)
}

func (s *ResolverSuite) TestRestartGRBReviewAsync() {
	ctx := s.testConfigs.Context

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
	status := CalcSystemIntakeGRBReviewAsyncStatus(ctx, systemIntake)
	s.NotNil(status)
	s.Equal(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress, *status)

	input := models.RestartGRBReviewInput{
		SystemIntakeID: systemIntake.ID,
		NewGRBEndDate:  time.Now().Add(2 * time.Hour),
	}

	// Restart the review
	updatedPayload, err := RestartGRBReviewAsync(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
		input,
	)

	// Check for errors
	s.NoError(err)
	s.NotNil(updatedPayload)
	s.NotNil(updatedPayload.SystemIntake)

	// Check the new start date
	s.NotNil(updatedPayload.SystemIntake.GRBReviewStartedAt)
	s.WithinDuration(time.Now(), *updatedPayload.SystemIntake.GRBReviewStartedAt, time.Second)

	// Check the new end date
	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncEndDate)
	s.WithinDuration(input.NewGRBEndDate, *updatedPayload.SystemIntake.GrbReviewAsyncEndDate, time.Second)

	// Check that manual end date is nil
	s.Nil(updatedPayload.SystemIntake.GrbReviewAsyncManualEndDate)
}
