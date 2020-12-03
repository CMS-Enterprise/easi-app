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

// ActionExecuter is a function that can execute an action
type ActionExecuter func(context.Context, *models.SystemIntake, *models.Action) error

// NewTakeAction is a service to create and execute an action
func NewTakeAction(
	fetch func(context.Context, uuid.UUID) (*models.SystemIntake, error),
	actionTypeMap map[models.ActionType]ActionExecuter,
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

		if executeAction, ok := actionTypeMap[action.ActionType]; ok {
			return executeAction(ctx, intake, action)
		}
		return &apperrors.ResourceConflictError{
			Err:        errors.New("invalid action type"),
			Resource:   intake,
			ResourceID: intake.ID.String(),
		}
	}
}

// NewSaveAction adds fields to an action and saves it in the db
func NewSaveAction(
	createAction func(context.Context, *models.Action) (*models.Action, error),
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
) func(context.Context, *models.Action) error {
	return func(ctx context.Context, action *models.Action) error {
		actorInfo, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
		if err != nil {
			return err
		}
		if actorInfo == nil || actorInfo.Email == "" || actorInfo.CommonName == "" || actorInfo.EuaUserID == "" {
			return &apperrors.ExternalAPIError{
				Err:       errors.New("user info fetch was not successful"),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		action.ActorName = actorInfo.CommonName
		action.ActorEmail = actorInfo.Email
		action.ActorEUAUserID = actorInfo.EuaUserID
		_, err = createAction(ctx, action)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     action,
				Operation: apperrors.QueryPost,
			}
		}

		return nil
	}
}

// NewSubmitSystemIntake returns a function that
// executes submit of a system intake
func NewSubmitSystemIntake(
	config Config,
	authorize func(context.Context, *models.SystemIntake) (bool, error),
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	validateAndSubmit func(context.Context, *models.SystemIntake) (string, error),
	saveAction func(context.Context, *models.Action) error,
	emailReviewer func(requester string, intakeID uuid.UUID) error,
) ActionExecuter {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		ok, err := authorize(ctx, intake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = models.SystemIntakeStatusINTAKESUBMITTED

		if intake.AlfabetID.Valid {
			err := &apperrors.ResourceConflictError{
				Err:        errors.New("intake has already been submitted to CEDAR"),
				ResourceID: intake.ID.String(),
				Resource:   intake,
			}
			return err
		}

		intake.SubmittedAt = &updatedTime
		alfabetID, validateAndSubmitErr := validateAndSubmit(ctx, intake)
		if validateAndSubmitErr != nil {
			return validateAndSubmitErr
		}
		// TODO: we are not submitting to CEDAR right now - EASI-1025
		// if alfabetID == "" {
		// 	return &apperrors.ExternalAPIError{
		// 		Err:       errors.New("submission was not successful"),
		// 		Model:     intake,
		// 		ModelID:   intake.ID.String(),
		// 		Operation: apperrors.Submit,
		// 		Source:    "CEDAR EASi",
		// 	}
		// }
		intake.AlfabetID = null.StringFrom(alfabetID)

		err = saveAction(ctx, action)
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

// NewSubmitBusinessCase returns a function that
// executes submit of a business case
func NewSubmitBusinessCase(
	config Config,
	authorize func(context.Context, *models.SystemIntake) (bool, error),
	fetchOpenBusinessCase func(context.Context, uuid.UUID) (*models.BusinessCase, error),
	validateForSubmit func(businessCase *models.BusinessCase) error,
	saveAction func(context.Context, *models.Action) error,
	updateIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	updateBusinessCase func(context.Context, *models.BusinessCase) (*models.BusinessCase, error),
	sendEmail func(requester string, intakeID uuid.UUID) error,
	newIntakeStatus models.SystemIntakeStatus,
) ActionExecuter {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		ok, err := authorize(ctx, intake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		businessCase, err := fetchOpenBusinessCase(ctx, intake.ID)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Operation: apperrors.QueryFetch,
				Model:     intake,
			}
		}
		// Uncomment below when UI has changed for unique lifecycle costs
		//err = appvalidation.BusinessCaseForUpdate(businessCase)
		//if err != nil {
		//	return &models.BusinessCase{}, err
		//}
		updatedAt := config.clock.Now()
		businessCase.UpdatedAt = &updatedAt

		if businessCase.InitialSubmittedAt == nil {
			businessCase.InitialSubmittedAt = &updatedAt
		}
		businessCase.LastSubmittedAt = &updatedAt
		if businessCase.SystemIntakeStatus == models.SystemIntakeStatusBIZCASEFINALNEEDED {
			err = validateForSubmit(businessCase)
			if err != nil {
				return err
			}
		}

		err = saveAction(ctx, action)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     action,
				Operation: apperrors.QueryPost,
			}
		}

		businessCase, err = updateBusinessCase(ctx, businessCase)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		intake.Status = newIntakeStatus
		intake.UpdatedAt = &updatedAt
		intake, err = updateIntake(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		err = sendEmail(businessCase.Requester.String, businessCase.SystemIntakeID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("Submit Business Case email failed to send: ", zap.Error(err))
		}

		return nil
	}
}

// NewTakeActionUpdateStatus returns a function that
// updates the status of a request
func NewTakeActionUpdateStatus(
	config Config,
	newStatus models.SystemIntakeStatus,
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	authorize func(context.Context) (bool, error),
	saveAction func(context.Context, *models.Action) error,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	sendReviewEmail func(emailText string, recipientAddress string) error,
	shouldCloseBusinessCase bool,
	closeBusinessCase func(context.Context, uuid.UUID) error,
) ActionExecuter {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		ok, err := authorize(ctx)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{}
		}

		requesterInfo, err := fetchUserInfo(ctx, intake.EUAUserID.ValueOrZero())
		if err != nil {
			return err
		}
		if requesterInfo == nil || requesterInfo.Email == "" {
			return &apperrors.ExternalAPIError{
				Err:       errors.New("requester info fetch was not successful when submitting an action"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		err = saveAction(ctx, action)
		if err != nil {
			return err
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = newStatus

		intake, err = update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		if shouldCloseBusinessCase && intake.BusinessCaseID != nil {
			if err = closeBusinessCase(ctx, *intake.BusinessCaseID); err != nil {
				return err
			}
		}

		err = sendReviewEmail(action.Feedback.String, requesterInfo.Email)
		if err != nil {
			return err
		}

		return nil
	}
}

// NewFetchActionsByRequestID returns a function that fetches actions for a specific request
func NewFetchActionsByRequestID(
	authorize func(context.Context) (bool, error),
	fetch func(context.Context, uuid.UUID) ([]models.Action, error),
) func(context.Context, uuid.UUID) ([]models.Action, error) {
	return func(ctx context.Context, intakeID uuid.UUID) ([]models.Action, error) {
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: errors.New("failed to authorize fetch actions")}
		}
		fetchedActions, err := fetch(ctx, intakeID)
		if err != nil {
			return nil, err
		}
		return fetchedActions, nil
	}
}
