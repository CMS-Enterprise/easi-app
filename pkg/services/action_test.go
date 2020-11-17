package services

import (
	"context"
	"errors"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestNewTakeAction() {
	ctx := context.Background()
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{ID: id}, nil
	}

	s.Run("returns QueryError if fetch fails", func() {
		failFetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return nil, errors.New("error")
		}
		createAction := NewTakeAction(failFetch, map[models.ActionType]ActionExecuter{})
		id := uuid.New()
		action := models.Action{
			IntakeID:   &id,
			ActionType: models.ActionTypeSUBMITINTAKE,
		}
		err := createAction(ctx, &action)
		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error from an action service", func() {
		submitError := errors.New("test")
		failSubmit := func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
			return submitError
		}
		createAction := NewTakeAction(fetch, map[models.ActionType]ActionExecuter{models.ActionTypeSUBMITINTAKE: failSubmit})
		id := uuid.New()
		action := models.Action{
			IntakeID:   &id,
			ActionType: models.ActionTypeSUBMITINTAKE,
		}
		err := createAction(ctx, &action)
		s.Equal(submitError, err)
	})

	s.Run("returns ResourceConflictError if invalid action type", func() {
		createAction := NewTakeAction(fetch, map[models.ActionType]ActionExecuter{})
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
	fetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
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
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		s.Equal(0, submitEmailCount)

		err := submitSystemIntake(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, submitEmailCount)
		s.Equal("ALFABET-ID", intake.AlfabetID.String)
		s.Equal("Name", createdAction.ActorName)

		submitEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, failAuthorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.Equal(authorizationError, err)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to fetch user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		fetchUserInfoError := errors.New("error")
		failFetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
			return nil, fetchUserInfoError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, failFetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.Equal(fetchUserInfoError, err)
	})

	s.Run("returns error if fetches bad user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		failFetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, failFetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.ExternalAPIError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		failCreateAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
			return nil, errors.New("error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, failCreateAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error when validation fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
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
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
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
			Status:    models.SystemIntakeStatusINTAKEDRAFT,
			AlfabetID: null.StringFrom("394-141-0"),
		}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &alreadySubmittedIntake, &action)

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns query error if update fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, failUpdate, submit, createAction, fetchUserInfo, sendSubmitEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})
}

func (s ServicesTestSuite) TestNewSubmitBizCase() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	updateIntake := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}

	updateBusinessCase := func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		return businessCase, nil
	}

	fetchOpenBusinessCase := func(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error) {
		return &models.BusinessCase{}, nil
	}

	validateForSubmit := func(businessCase *models.BusinessCase) error {
		return nil
	}

	var createdAction models.Action
	createAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
		createdAction = *action
		return action, nil
	}
	fetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			CommonName: "Name",
			Email:      "name@site.com",
			EuaUserID:  testhelpers.RandomEUAID(),
		}, nil
	}
	submitEmailCount := 0
	sendSubmitEmail := func(requester string, intakeID uuid.UUID) error {
		submitEmailCount++
		return nil
	}

	s.Run("golden path submit Biz Case", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, createAction, fetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		s.Equal(0, submitEmailCount)

		err := submitBusinessCase(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, submitEmailCount)
		s.Equal("Name", createdAction.ActorName)

		submitEmailCount = 0
	})

	s.Run("submit Biz Case sets the intake status to the value passed", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEFINALSUBMITTED
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, createAction, fetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		s.Equal(0, submitEmailCount)

		err := submitBusinessCase(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, submitEmailCount)
		s.Equal("Name", createdAction.ActorName)
		s.Equal(intake.Status, status)

		submitEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, failAuthorize, fetchOpenBusinessCase, validateForSubmit, createAction, fetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.Equal(authorizationError, err)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, unauthorize, fetchOpenBusinessCase, validateForSubmit, createAction, fetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to fetch user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		fetchUserInfoError := errors.New("error")
		failFetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
			return nil, fetchUserInfoError
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, createAction, failFetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.Equal(fetchUserInfoError, err)
	})

	s.Run("returns error if fetches bad user info", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		failFetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, createAction, failFetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.ExternalAPIError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		failCreateAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
			return nil, errors.New("error")
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, failCreateAction, fetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error when validation fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		failValidation := func(businessCase *models.BusinessCase) error {
			return &apperrors.ValidationError{
				Err:     errors.New("validation failed on these fields: ID"),
				ModelID: businessCase.ID.String(),
				Model:   businessCase,
			}
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, failValidation, createAction, fetchUserInfo, updateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(0, submitEmailCount)
	})

	s.Run("returns query error if update intake fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		failUpdateIntake := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, createAction, fetchUserInfo, failUpdateIntake, updateBusinessCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns query error if update biz case fails", func() {
		intake := models.SystemIntake{Status: models.SystemIntakeStatusINTAKEDRAFT}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		status := models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED
		failUpdateBizCase := func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("update error")
		}
		submitBusinessCase := NewSubmitBusinessCase(serviceConfig, authorize, fetchOpenBusinessCase, validateForSubmit, createAction, fetchUserInfo, updateIntake, failUpdateBizCase, sendSubmitEmail, status)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})
}

func (s ServicesTestSuite) TestNewTakeActionUpdateStatus() {
	logger := zap.NewNop()

	requester := "Test Requester"
	bizCaseID := uuid.New()
	save := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			EUAUserID:      intake.EUAUserID,
			Requester:      requester,
			Status:         intake.Status,
			AlfabetID:      intake.AlfabetID,
			BusinessCaseID: &bizCaseID,
		}, nil
	}
	authorize := func(_ context.Context) (bool, error) {
		return true, nil
	}
	fetchUserInfo := func(_ context.Context, euaID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Email:      "name@site.com",
			CommonName: "NAME",
			EuaUserID:  testhelpers.RandomEUAID(),
		}, nil
	}
	reviewEmailCount := 0
	feedbackForEmailText := ""
	sendReviewEmail := func(emailText string, recipientAddress string) error {
		feedbackForEmailText = emailText
		reviewEmailCount++
		return nil
	}
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	var createdAction models.Action
	createAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
		createdAction = *action
		return action, nil
	}
	closeBusinessCaseCount := 0
	closeBusinessCase := func(ctx context.Context, id uuid.UUID) error {
		closeBusinessCaseCount++
		return nil
	}

	s.Run("golden path review system intake", func() {
		ctx := context.Background()
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			authorize,
			createAction,
			fetchUserInfo,
			sendReviewEmail,
			true,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{Feedback: null.StringFrom("feedback")}
		err := reviewSystemIntake(ctx, intake, action)

		s.NoError(err)
		s.Equal("NAME", createdAction.ActorName)
		s.Equal(1, reviewEmailCount)
		s.Equal(1, closeBusinessCaseCount)
		s.Equal("feedback", feedbackForEmailText)
	})

	s.Run("returns error when authorization errors", func() {
		ctx := context.Background()
		err := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context) (bool, error) {
			return false, err
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			failAuthorize,
			createAction,
			fetchUserInfo,
			sendReviewEmail,
			false,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{}
		actualError := reviewSystemIntake(ctx, intake, action)

		s.Error(err)
		s.Equal(err, actualError)
	})

	s.Run("returns unauthorized error when authorization not ok", func() {
		ctx := context.Background()
		notOKAuthorize := func(ctx context.Context) (bool, error) {
			return false, nil
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			notOKAuthorize,
			createAction,
			fetchUserInfo,
			sendReviewEmail,
			false,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{}
		err := reviewSystemIntake(ctx, intake, action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		ctx := context.Background()
		failCreateAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
			return nil, errors.New("error")
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			authorize,
			failCreateAction,
			fetchUserInfo,
			sendReviewEmail,
			false,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{}
		err := reviewSystemIntake(ctx, intake, action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error from fetching requester email", func() {
		reviewEmailCount = 0
		ctx := context.Background()
		failFetchUserInfo := func(_ context.Context, euaID string) (*models.UserInfo, error) {
			return nil, &apperrors.ExternalAPIError{
				Err:       errors.New("sample error"),
				Model:     models.UserInfo{},
				ModelID:   euaID,
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			authorize,
			createAction,
			failFetchUserInfo,
			sendReviewEmail,
			false,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{}
		err := reviewSystemIntake(ctx, intake, action)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, reviewEmailCount)
	})

	s.Run("returns ExternalAPIError if requester email not returned", func() {
		ctx := context.Background()
		failFetchUserInfo := func(_ context.Context, euaID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			authorize,
			createAction,
			failFetchUserInfo,
			sendReviewEmail,
			false,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{}
		err := reviewSystemIntake(ctx, intake, action)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, reviewEmailCount)
	})

	s.Run("returns error if closeBusinessCase fails", func() {
		ctx := context.Background()
		failCloseBusinessCase := func(ctx context.Context, id uuid.UUID) error {
			return errors.New("error")
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			authorize,
			createAction,
			fetchUserInfo,
			sendReviewEmail,
			true,
			failCloseBusinessCase,
		)
		bizCaseID := uuid.New()
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED, BusinessCaseID: &bizCaseID}
		action := &models.Action{Feedback: null.StringFrom("feedback")}
		err := reviewSystemIntake(ctx, intake, action)

		s.Error(err)
	})

	s.Run("returns notification error when review email fails", func() {
		ctx := context.Background()
		failSendReviewEmail := func(emailText string, recipientAddress string) error {
			return &apperrors.NotificationError{
				Err:             errors.New("failed to send Email"),
				DestinationType: apperrors.DestinationTypeEmail,
			}
		}
		reviewSystemIntake := NewTakeActionUpdateStatus(
			serviceConfig,
			models.SystemIntakeStatusNOTITREQUEST,
			save,
			authorize,
			createAction,
			fetchUserInfo,
			failSendReviewEmail,
			false,
			closeBusinessCase,
		)
		intake := &models.SystemIntake{Status: models.SystemIntakeStatusINTAKESUBMITTED}
		action := &models.Action{}
		err := reviewSystemIntake(ctx, intake, action)

		s.IsType(&apperrors.NotificationError{}, err)
	})
}

func (s ServicesTestSuite) TestFetchActions() {
	fetch := func(_ context.Context, _ uuid.UUID) ([]models.Action, error) {
		return []models.Action{
			{},
			{},
		}, nil
	}
	failFetch := func(_ context.Context, _ uuid.UUID) ([]models.Action, error) {
		return nil, errors.New("failFetch")
	}
	authorize := func(_ context.Context) (bool, error) {
		return true, nil
	}
	unauthorize := func(_ context.Context) (bool, error) {
		return false, nil
	}
	failAuthorize := func(_ context.Context) (bool, error) {
		return false, errors.New("fail authorization")
	}

	tests := map[string]struct {
		fn                      func(ctx context.Context, id uuid.UUID) ([]models.Action, error)
		shouldError             bool
		numberOfReturnedActions int
	}{
		"happy path": {
			fn:                      NewFetchActionsByRequestID(authorize, fetch),
			shouldError:             false,
			numberOfReturnedActions: 2,
		},
		"authorization fails": {
			fn:                      NewFetchActionsByRequestID(failAuthorize, fetch),
			shouldError:             true,
			numberOfReturnedActions: 0,
		},
		"unauthorized": {
			fn:                      NewFetchActionsByRequestID(unauthorize, fetch),
			shouldError:             true,
			numberOfReturnedActions: 0,
		},
		"errors when talking to storage layer": {
			fn:                      NewFetchActionsByRequestID(authorize, failFetch),
			shouldError:             true,
			numberOfReturnedActions: 0,
		},
	}

	for name, tc := range tests {
		s.Run(name, func() {
			actions, err := tc.fn(context.Background(), uuid.New())
			if tc.shouldError {
				s.Error(err)
				s.Nil(actions)
			} else {
				s.NoError(err)
				s.Len(actions, tc.numberOfReturnedActions)
			}
		})
	}

}
