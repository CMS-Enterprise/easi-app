package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	models2 "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestNewSubmitSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	createAction := func(ctx context.Context, action *models.SystemIntakeAction) (*models.SystemIntakeAction, error) {
		return action, nil
	}
	fetchUserInfo := func(logger *zap.Logger, EUAUserID string) (*models2.Person, error) {
		return &models2.Person{
			CommonName: "Name",
			Email:      "name@site.com",
			UserName:   testhelpers.RandomEUAID(),
		}, nil
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
		action := models.SystemIntakeAction{}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		s.Equal(0, submitEmailCount)

		err := submitSystemIntake(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, submitEmailCount)
		s.Equal("ALFABET-ID", intake.AlfabetID.String)
		s.Equal("Name", action.ActorName)

		submitEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, failAuthorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.Equal(authorizationError, err)
	})

	s.Run("returns resource conflict error if status is not DRAFT", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusSUBMITTED}
		action := models.SystemIntakeAction{}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)

		err := submitSystemIntake(ctx, &intake, &action)
		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)

	})

	s.Run("returns unauthorized error if authorization denied", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to fetch user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		fetchUserInfoError := errors.New("error")
		failFetchUserInfo := func(logger *zap.Logger, EUAUserID string) (*models2.Person, error) {
			return nil, fetchUserInfoError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, failFetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.Equal(fetchUserInfoError, err)
	})

	s.Run("returns error if fetches bad user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		failFetchUserInfo := func(logger *zap.Logger, EUAUserID string) (*models2.Person, error) {
			return &models2.Person{}, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, failFetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.ExternalAPIError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		failCreateAction := func(ctx context.Context, action *models.SystemIntakeAction) (*models.SystemIntakeAction, error) {
			return nil, errors.New("error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, failCreateAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error when validation fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		failValidationSubmit := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ValidationError{
				Err:     errors.New("validation failed on these fields: ID"),
				ModelID: intake.ID.String(),
				Model:   intake,
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns error when submission fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		failValidationSubmit := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ExternalAPIError{
				Err:       errors.New("CEDAR return result: unexpected failure"),
				ModelID:   intake.ID.String(),
				Model:     intake,
				Operation: apperrors.Submit,
				Source:    "CEDAR",
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns error when intake has already been submitted", func() {
		alreadySubmittedIntake := models.SystemIntake{
			Status:    models.SystemIntakeStatusDRAFT,
			AlfabetID: null.StringFrom("394-141-0"),
		}
		action := models.SystemIntakeAction{}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &alreadySubmittedIntake, &action)

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns query error if update fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		action := models.SystemIntakeAction{}
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, failUpdate, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})
}
