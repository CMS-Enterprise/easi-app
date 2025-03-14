package resolvers

import (
	"errors"
	"time"

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

	s.NotNil(updatedPayload.SystemIntake.GrbReviewAsyncEndDate)
	s.WithinDuration(timeNow, *updatedPayload.SystemIntake.GrbReviewAsyncEndDate, time.Second)
}

func (s *ResolverSuite) TestCalcSystemIntakeGRBReviewAsyncStatus() {
	now := time.Now()
	futureTime := now.Add(24 * time.Hour) // 24 hours in the future
	expectedFutureTime := time.Unix(0, 0).Add(futureTime.Sub(now))
	pastTime := now.Add(-24 * time.Hour) // 24 hours in the past
	expectedPastTime := time.Unix(0, 0).Add(now.Sub(pastTime))
	systemIntakeID := uuid.New()

	tests := []struct {
		name        string
		intake      models.SystemIntake
		expectedErr error
		expected    *models.SystemIntakeGRBReviewAsyncStatus
	}{
		{
			name: "Error - GRB Review Async end date is not set",
			intake: models.SystemIntake{
				ID:            systemIntakeID,
				GrbReviewType: models.SystemIntakeGRBReviewTypeAsync,
			},
			expectedErr: errors.New("System intake GRB Review Async end date is not set"),
			expected:    nil,
		},
		{
			name: "Status - In Progress (End date is in the future)",
			intake: models.SystemIntake{
				ID:                    systemIntakeID,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: &futureTime,
			},
			expectedErr: nil,
			expected: &models.SystemIntakeGRBReviewAsyncStatus{
				Status:        models.SystemIntakeGRBReviewAsyncStatusTypeInProgress,
				TimeRemaining: &expectedFutureTime,
				TimePastDue:   nil,
			},
		},
		{
			name: "Status - Completed (End date is in the past)",
			intake: models.SystemIntake{
				ID:                    systemIntakeID,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: &pastTime,
			},
			expectedErr: nil,
			expected: &models.SystemIntakeGRBReviewAsyncStatus{
				Status:        models.SystemIntakeGRBReviewAsyncStatusTypeCompleted,
				TimeRemaining: nil,
				TimePastDue:   &expectedPastTime,
			},
		},
	}

	for _, tc := range tests {
		s.Run(tc.name, func() {
			status, err := CalcSystemIntakeGRBReviewAsyncStatus(&tc.intake)

			// Check for expected error
			if tc.expectedErr != nil {
				s.Error(err)
				s.Equal(tc.expectedErr.Error(), err.Error())
				s.Nil(status)
			} else {
				// No errors expected
				s.NoError(err)
				s.NotNil(status)
				s.Equal(tc.expected.Status, status.Status)

				// Validate time calculations
				if tc.expected.TimeRemaining != nil {
					s.WithinDuration(*tc.expected.TimeRemaining, *status.TimeRemaining, time.Second)
				} else {
					s.Nil(status.TimeRemaining)
				}

				if tc.expected.TimePastDue != nil {
					s.WithinDuration(*tc.expected.TimePastDue, *status.TimePastDue, time.Second)
				} else {
					s.Nil(status.TimePastDue)
				}
			}
		})
	}
}
