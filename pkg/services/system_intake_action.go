package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewCreateSystemIntakeAction is a service to create and execute a system intake action
func NewCreateSystemIntakeAction(
	fetch func(context.Context, uuid.UUID) (*models.SystemIntake, error),
	submit func(context.Context, *models.SystemIntake) error,
) func(context.Context, *models.Action) error {
	return func(ctx context.Context, action *models.Action) error {
		intake, fetchErr := fetch(ctx, *action.IntakeID)
		if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     intake,
			}
		}

		switch action.ActionType {
		case models.ActionTypeSUBMIT:
			return submit(ctx, intake)
		default:
			return &apperrors.ResourceConflictError{
				Err:        errors.New("invalid system intake action type"),
				Resource:   intake,
				ResourceID: intake.ID.String(),
			}
		}
	}
}

// NewSubmitSystemIntake returns a function that
// executes submit of a system intake
func NewSubmitSystemIntake(
	config Config,
	authorize func(context.Context, *models.SystemIntake) (bool, error),
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	validateAndSubmit func(context.Context, *models.SystemIntake) (string, error),
	createAction func(context.Context, *models.Action) (*models.Action, error),
	fetchUserInfo func(*zap.Logger, string) (*models.UserInfo, error),
	emailReviewer func(requester string, intakeID uuid.UUID) error,
) func(context.Context, *models.SystemIntake) error {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		ok, err := authorize(ctx, intake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		if intake.Status != models.SystemIntakeStatusDRAFT {
			err := &apperrors.ResourceConflictError{
				Err:        errors.New("intake is not in DRAFT state"),
				ResourceID: intake.ID.String(),
				Resource:   intake,
			}
			return err
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = models.SystemIntakeStatusSUBMITTED

		if intake.AlfabetID.Valid {
			err := &apperrors.ResourceConflictError{
				Err:        errors.New("intake has already been submitted to CEDAR"),
				ResourceID: intake.ID.String(),
				Resource:   intake,
			}
			return err
		}

		userInfo, err := fetchUserInfo(appcontext.ZLogger(ctx), appcontext.Principal(ctx).ID())
		if err != nil {
			return err
		}
		if userInfo == nil || userInfo.Email == "" || userInfo.CommonName == "" || userInfo.EuaUserID == "" {
			return &apperrors.ExternalAPIError{
				Err:       errors.New("user info fetch was not successful"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		intake.SubmittedAt = &updatedTime
		alfabetID, validateAndSubmitErr := validateAndSubmit(ctx, intake)
		if validateAndSubmitErr != nil {
			return validateAndSubmitErr
		}
		if alfabetID == "" {
			return &apperrors.ExternalAPIError{
				Err:       errors.New("submission was not successful"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Submit,
				Source:    "CEDAR EASi",
			}
		}
		intake.AlfabetID = null.StringFrom(alfabetID)

		action := models.Action{
			IntakeID:       &intake.ID,
			ActionType:     models.ActionTypeSUBMIT,
			ActorName:      userInfo.CommonName,
			ActorEmail:     userInfo.Email,
			ActorEUAUserID: userInfo.EuaUserID,
		}
		_, err = createAction(ctx, &action)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     action,
				Operation: apperrors.QueryPost,
			}
		}

		intake, err = update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}
		// only send an email when everything went ok
		err = emailReviewer(intake.Requester, intake.ID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("Submit Intake email failed to send: ", zap.Error(err))
		}

		return nil
	}
}

// NewGRTReviewSystemIntake returns a function that
// reviews a system intake
func NewGRTReviewSystemIntake(
	config Config,
	newStatus models.SystemIntakeStatus,
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	authorize func(context.Context, *models.SystemIntake) (bool, error),
	fetchRequesterInfo func(*zap.Logger, string) (*models.UserInfo, error),
	sendReviewEmail func(emailText string, recipientAddress string) error,
) func(context.Context, *models.SystemIntake, *models.Action) error {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		ok, err := authorize(ctx, intake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		requesterInfo, err := fetchRequesterInfo(appcontext.ZLogger(ctx), intake.EUAUserID)
		if err != nil {
			return err
		}
		if requesterInfo == nil || requesterInfo.Email == "" {
			return &apperrors.ExternalAPIError{
				Err:       errors.New("user info fetch was not successful"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = newStatus
		intake.GrtReviewEmailBody = null.StringFrom(action.Feedback)
		intake.RequesterEmailAddress = null.StringFrom(requesterInfo.Email)
		intake.DecidedAt = &updatedTime
		intake.UpdatedAt = &updatedTime

		intake, err = update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		err = sendReviewEmail(intake.GrtReviewEmailBody.String, requesterInfo.Email)
		if err != nil {
			return err
		}

		return nil
	}
}
