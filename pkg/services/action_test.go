package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ServicesTestSuite) TestNewTakeAction() {
	ctx := context.Background()
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{ID: id}, nil
	}

	s.Run("returns error from an action service", func() {
		submitError := errors.New("test")
		failSubmit := func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
			return submitError
		}
		createAction := NewBusinessCaseTakeAction(fetch, failSubmit)
		id := uuid.New()
		action := models.Action{
			IntakeID:   &id,
			ActionType: models.ActionTypeSUBMITBIZCASE,
		}
		err := createAction(ctx, &action)
		s.Equal(submitError, err)
	})
}

func (s *ServicesTestSuite) TestNewSubmitSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorized := func(ctx context.Context, intake *models.SystemIntake) bool { return true }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}

	saveAction := func(ctx context.Context, action *models.Action) error {
		return nil
	}

	submit := func(c context.Context, intake *models.SystemIntake) (string, error) {
		return "ALFABET-ID", nil
	}
	sendRequesterEmailCount := 0
	sendReviewerEmailCount := 0
	sendRequesterEmail := func(
		ctx context.Context,
		requesterEmailAddress models.EmailAddress,
		intakeID uuid.UUID,
		requestName string,
		isResubmitted bool,
	) error {
		sendRequesterEmailCount++
		return nil
	}
	sendReviewerEmail := func(
		ctx context.Context,
		intakeID uuid.UUID,
		requestName string,
		requesterName string,
		requesterComponent string,
		requestType models.SystemIntakeRequestType,
		processStage string,
		isResubmitted bool,
	) error {
		sendReviewerEmailCount++
		return nil
	}

	s.Run("golden path submit intake", func() {
		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorized, update, submit, saveAction, sendRequesterEmail, sendReviewerEmail)
		s.Equal(0, sendRequesterEmailCount)
		s.Equal(0, sendReviewerEmailCount)

		err := submitSystemIntake(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, sendRequesterEmailCount)
		s.Equal("ALFABET-ID", intake.AlfabetID.String)

		sendRequesterEmailCount = 0
		sendReviewerEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		unauthorized := func(ctx context.Context, intake *models.SystemIntake) bool {
			return false
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorized, update, submit, saveAction, sendRequesterEmail, sendReviewerEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		unauthorized := func(ctx context.Context, intake *models.SystemIntake) bool {
			return false
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorized, update, submit, saveAction, sendRequesterEmail, sendReviewerEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		failCreateAction := func(ctx context.Context, action *models.Action) error {
			return errors.New("error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorized, update, submit, failCreateAction, sendRequesterEmail, sendReviewerEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns nil and sends email even if submission fails", func() {
		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		failSubmitToCEDAR := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ExternalAPIError{
				Err:       errors.New("CEDAR return result: unexpected failure"),
				ModelID:   intake.ID.String(),
				Model:     intake,
				Operation: apperrors.Submit,
				Source:    "CEDAR",
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorized, update, failSubmitToCEDAR, saveAction, sendRequesterEmail, sendReviewerEmail)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(nil, err)
		s.Equal(1, sendRequesterEmailCount)
		s.Equal(1, sendReviewerEmailCount)
	})

	s.Run("doesn't return error when intake has already been submitted", func() {
		// This is updated for ITGov V2
		alreadySubmittedIntake := models.SystemIntake{
			AlfabetID: null.StringFrom("394-141-0"),
		}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		submitSystemIntake := NewSubmitSystemIntake(
			serviceConfig,
			authorized,
			update,
			submit,
			saveAction,
			sendRequesterEmail,
			sendReviewerEmail,
		)
		err := submitSystemIntake(ctx, &alreadySubmittedIntake, &action)
		s.NoError(err)

		s.Equal(2, sendRequesterEmailCount)
		s.Equal(2, sendReviewerEmailCount)
	})

	s.Run("returns query error if update fails", func() {
		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITINTAKE}
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitSystemIntake := NewSubmitSystemIntake(
			serviceConfig,
			authorized,
			failUpdate,
			submit,
			saveAction,
			sendRequesterEmail,
			sendReviewerEmail,
		)
		err := submitSystemIntake(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})
}

func (s *ServicesTestSuite) TestNewSubmitBizCase() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorized := func(ctx context.Context, intake *models.SystemIntake) bool { return true }
	updateIntake := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}

	updateBusinessCase := func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
		return businessCase, nil
	}

	fetchOpenBusinessCase := func(ctx context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
		return &models.BusinessCaseWithCosts{}, nil
	}

	validateForSubmit := func(businessCase *models.BusinessCaseWithCosts) error {
		return nil
	}

	saveAction := func(ctx context.Context, action *models.Action) error {
		return nil
	}

	s.Run("golden path submit Biz Case", func() {
		sendRequesterEmailCount := 0
		sendReviewerEmailCount := 0
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			sendRequesterEmailCount++
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			sendReviewerEmailCount++
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		s.Equal(0, sendRequesterEmailCount)
		s.Equal(0, sendReviewerEmailCount)

		err := submitBusinessCase(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, sendRequesterEmailCount)
		s.Equal(1, sendReviewerEmailCount)
	})

	s.Run("returns error from authorization if authorization fails", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		unauthorized := func(ctx context.Context, intake *models.SystemIntake) bool {
			return false
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			unauthorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		unauthorized := func(ctx context.Context, intake *models.SystemIntake) bool {
			return false
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			unauthorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error if fails to save action", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		failCreateAction := func(ctx context.Context, action *models.Action) error {
			return errors.New("error")
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			failCreateAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("does not return error for validation if status is not biz case final", func() {
		sendRequesterEmailCount := 0
		sendReviewerEmailCount := 0
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			sendRequesterEmailCount++
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			sendReviewerEmailCount++
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{Step: models.SystemIntakeStepDRAFTBIZCASE}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		failValidation := func(businessCase *models.BusinessCaseWithCosts) error {
			return &apperrors.ValidationError{
				Err:     errors.New("validation failed on these fields: ID"),
				ModelID: businessCase.ID.String(),
				Model:   businessCase,
			}
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			failValidation,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, sendRequesterEmailCount)
		s.Equal(1, sendReviewerEmailCount)
	})

	s.Run("returns error when status is biz case final and validation fails", func() {
		sendRequesterEmailCount := 0
		sendReviewerEmailCount := 0
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			sendRequesterEmailCount++
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			sendReviewerEmailCount++
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{Step: models.SystemIntakeStepFINALBIZCASE}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		failValidation := func(businessCase *models.BusinessCaseWithCosts) error {
			return &apperrors.ValidationError{
				Err:     errors.New("validation failed on these fields: ID"),
				ModelID: businessCase.ID.String(),
				Model:   businessCase,
			}
		}
		fetchOpenBusinessCase = func(ctx context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{}, nil
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			failValidation,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(0, sendRequesterEmailCount)
		s.Equal(0, sendReviewerEmailCount)
	})

	s.Run("returns query error if update intake fails", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		failUpdateIntake := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			failUpdateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns query error if update biz case fails", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		submitToCEDARStub := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return nil
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}
		failUpdateBizCase := func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{}, errors.New("update error")
		}
		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			updateIntake,
			failUpdateBizCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARStub,
		)
		err := submitBusinessCase(ctx, &intake, &action)

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("Submits business case data to CEDAR when submitting draft business case", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		submitToCEDARCount := 0
		submitToCEDARMock := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			submitToCEDARCount++
			return nil
		}

		intake := models.SystemIntake{
			Step: models.SystemIntakeStepDRAFTBIZCASE,
		}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}

		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			submitToCEDARMock,
		)
		s.Equal(0, submitToCEDARCount)

		err := submitBusinessCase(ctx, &intake, &action)

		s.NoError(err)
		s.Equal(1, submitToCEDARCount)
	})

	s.Run("Error submitting business case data to CEDAR when submitting draft business case does not return overall error", func() {
		sendRequesterEmail := func(
			ctx context.Context,
			requesterEmail models.EmailAddress,
			requestName string,
			intakeID uuid.UUID,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}
		sendReviewerEmail := func(
			ctx context.Context,
			intakeID uuid.UUID,
			requesterName string,
			requestName string,
			isResubmitted bool,
			isDraft bool,
		) error {
			return nil
		}

		failSubmitToCEDAR := func(ctx context.Context, bc models.BusinessCaseWithCosts) error {
			return errors.New("Could not submit business case to CEDAR")
		}

		intake := models.SystemIntake{}
		action := models.Action{ActionType: models.ActionTypeSUBMITBIZCASE}

		submitBusinessCase := NewSubmitBusinessCase(
			serviceConfig,
			authorized,
			fetchOpenBusinessCase,
			validateForSubmit,
			saveAction,
			updateIntake,
			updateBusinessCase,
			sendRequesterEmail,
			sendReviewerEmail,
			failSubmitToCEDAR,
		)

		err := submitBusinessCase(ctx, &intake, &action)

		s.NoError(err)
	})
}

func (s *ServicesTestSuite) TestNewSaveAction() {
	createAction := func(_ context.Context, action *models.Action) (*models.Action, error) {
		return action, nil
	}

	failCreateAction := func(_ context.Context, action *models.Action) (*models.Action, error) {
		return nil, errors.New("failed createAction")
	}

	fetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			DisplayName: "name",
			Email:       "email",
			Username:    "ABCD",
		}, nil
	}

	failFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return nil, errors.New("failed fetchUserInfo")
	}

	tests := map[string]struct {
		fn          func(context.Context, *models.Action) error
		shouldError bool
	}{
		"happy path": {
			fn:          NewSaveAction(createAction, fetchUserInfo),
			shouldError: false,
		},
		"fails to fetch user info from CEDAR": {
			fn:          NewSaveAction(failCreateAction, fetchUserInfo),
			shouldError: true,
		},
		"fails to save action": {
			fn:          NewSaveAction(createAction, failFetchUserInfo),
			shouldError: true,
		},
	}

	for name, tc := range tests {
		s.Run(name, func() {
			intakeID := uuid.New()
			err := tc.fn(context.Background(), &models.Action{
				IntakeID:   &intakeID,
				ActionType: models.ActionTypeSUBMITINTAKE,
				Feedback:   nil,
			})
			if tc.shouldError {
				s.Error(err)
			} else {
				s.NoError(err)
			}
		})
	}
}
