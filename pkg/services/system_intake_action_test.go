package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestNewCreateSystemIntakeAction() {
	ctx := context.Background()
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{ID: id}, nil
	}
	submit := func(ctx context.Context, intake *models.SystemIntake) error {
		return nil
	}
	reviewNotITRequest := func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		return nil
	}

	s.Run("returns QueryError if fetch fails", func() {
		failFetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return nil, errors.New("error")
		}
		createAction := NewCreateSystemIntakeAction(failFetch, submit, reviewNotITRequest)
		id := uuid.New()
		action := models.Action{
			IntakeID:   &id,
			ActionType: models.ActionTypeSUBMIT,
		}
		err := createAction(ctx, &action)
		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error from submit", func() {
		submitError := errors.New("test")
		failSubmit := func(ctx context.Context, intake *models.SystemIntake) error {
			return submitError
		}
		createAction := NewCreateSystemIntakeAction(fetch, failSubmit, reviewNotITRequest)
		id := uuid.New()
		action := models.Action{
			IntakeID:   &id,
			ActionType: models.ActionTypeSUBMIT,
		}
		err := createAction(ctx, &action)
		s.Equal(submitError, err)
	})

	s.Run("returns ResourceConflictError if invalid action type", func() {
		createAction := NewCreateSystemIntakeAction(fetch, submit, reviewNotITRequest)
		id := uuid.New()
		action := models.Action{
			IntakeID:   &id,
			ActionType: "INVALID",
		}
		err := createAction(ctx, &action)
		s.IsType(&apperrors.ResourceConflictError{}, err)
	})
}

func (s ServicesTestSuite) TestNewSubmitSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}

	var createdAction models.Action
	createAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
		createdAction = *action
		return action, nil
	}
	fetchUserInfo := func(logger *zap.Logger, EUAUserID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			CommonName: "Name",
			Email:      "name@site.com",
			EuaUserID:  testhelpers.RandomEUAID(),
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
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		s.Equal(0, submitEmailCount)

		err := submitSystemIntake(ctx, &intake)

		s.NoError(err)
		s.Equal(1, submitEmailCount)
		s.Equal("ALFABET-ID", intake.AlfabetID.String)
		s.Equal("Name", createdAction.ActorName)

		submitEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, failAuthorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.Equal(authorizationError, err)
	})

	s.Run("returns resource conflict error if status is not DRAFT", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusSUBMITTED}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)

		err := submitSystemIntake(ctx, &intake)
		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)

	})

	s.Run("returns unauthorized error if authorization denied", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to fetch user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		fetchUserInfoError := errors.New("error")
		failFetchUserInfo := func(logger *zap.Logger, EUAUserID string) (*models.UserInfo, error) {
			return nil, fetchUserInfoError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, failFetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.Equal(fetchUserInfoError, err)
	})

	s.Run("returns error if fetches bad user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		failFetchUserInfo := func(logger *zap.Logger, EUAUserID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, failFetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.ExternalAPIError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		failCreateAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
			return nil, errors.New("error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, failCreateAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.QueryError{}, err)
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
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, createAction, fetchUserInfo, sendSubmitEmail)
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
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns error when intake has already been submitted", func() {
		alreadySubmittedIntake := models.SystemIntake{
			Status:    models.SystemIntakeStatusDRAFT,
			AlfabetID: null.StringFrom("394-141-0"),
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &alreadySubmittedIntake)

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns query error if update fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusDRAFT}
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, failUpdate, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake)

		s.IsType(&apperrors.QueryError{}, err)
	})
}
