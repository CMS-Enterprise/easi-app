package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestNewSubmitSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	submit := func(c context.Context, intake *models.SystemIntake) (string, error) {
		return "ALFABET-ID", nil
	}
	submitEmailCount := 0
	sendSubmitEmail := func(requester string, intakeID uuid.UUID) error {
		submitEmailCount++
		return nil
	}

	s.Run("golden path submit intake", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, sendSubmitEmail)
		s.Equal(0, submitEmailCount)

		err := submitSystemIntake(ctx, &intake)

		s.NoError(err)
		s.Equal(1, submitEmailCount)
		s.Equal("ALFABET-ID", intake.AlfabetID.String)

		submitEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, failAuthorize, update, submit, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.Equal(authorizationError, err)
	})

	s.Run("returns resource conflict error if status is not DRAFT", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusSUBMITTED}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, sendSubmitEmail)

		err := submitSystemIntake(ctx, &intake)
		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)

	})

	s.Run("returns unauthorized error if authorization denied", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorize, update, submit, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error when validation fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		failValidationSubmit := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ValidationError{
				Err:     errors.New("validation failed on these fields: ID"),
				ModelID: intake.ID.String(),
				Model:   intake,
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns error when submission fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		failValidationSubmit := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ExternalAPIError{
				Err:       errors.New("CEDAR return result: unexpected failure"),
				ModelID:   intake.ID.String(),
				Model:     intake,
				Operation: apperrors.Submit,
				Source:    "CEDAR",
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns error when intake has already been submitted", func() {
		alreadySubmittedIntake := models.SystemIntake{
			Status:    models.SystemIntakeStatusDRAFT,
			AlfabetID: null.StringFrom("394-141-0"),
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, sendSubmitEmail)
		err := submitSystemIntake(ctx, &alreadySubmittedIntake)

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns query error if update fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, failUpdate, submit, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.QueryError{}, err)
	})
}
