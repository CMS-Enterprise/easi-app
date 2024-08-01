package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
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
		if actorInfo == nil || actorInfo.Email == "" || actorInfo.DisplayName == "" || actorInfo.Username == "" {
			return &apperrors.ExternalAPIError{
				Err:       errors.New("user info fetch was not successful"),
				Operation: apperrors.Fetch,
				Source:    "Okta",
			}
		}

		action.ActorName = actorInfo.DisplayName
		action.ActorEmail = actorInfo.Email
		action.ActorEUAUserID = actorInfo.Username
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
	authorized func(context.Context, *models.SystemIntake) bool,
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	submitToCEDAR func(context.Context, *models.SystemIntake) (string, error),
	saveAction func(context.Context, *models.Action) error,
	emailRequester func(
		ctx context.Context,
		requesterEmailAddress models.EmailAddress,
		intakeID uuid.UUID,
		requestName string,
		isResubmitted bool,
	) error,
	emailReviewer func(
		ctx context.Context,
		intakeID uuid.UUID,
		requestName string,
		requesterName string,
		requesterComponent string,
		requestType models.SystemIntakeRequestType,
		processStage string,
		isResubmitted bool,
	) error,
) ActionExecuter {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		if !authorized(ctx, intake) {
			return &apperrors.UnauthorizedError{Err: errors.New("user is unauthorized to submit system intake")}
		}

		isResubmitted := false
		if intake.RequestFormState == models.SIRFSEditsRequested {
			isResubmitted = true
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		// Set intake state based on v2 logic
		intake.RequestFormState = models.SIRFSSubmitted
		intake.SubmittedAt = &updatedTime

		intakeSubmittedToCedar := intake.AlfabetID.Valid // When submitted to CEDAR, the AlfabetID gets set. If set, we currently don't re-submit it
		if !intakeSubmittedToCedar {
			// Send SystemIntake to CEDAR Intake API
			alfabetID, submitToCEDARErr := submitToCEDAR(ctx, intake)
			if submitToCEDARErr != nil {
				appcontext.ZLogger(ctx).Error("Submission to CEDAR failed", zap.Error(submitToCEDARErr))
			} else {
				// If submission to CEDAR was successful, update the intake with the alfabetID
				// AlfabetID can be null if:
				// - The intake was not submitted to CEDAR (due to the feature flag being off
				// or the Intake being imported from SharePoint)
				// - An error is encountered when sending the data to CEDAR.
				intake.AlfabetID = null.StringFrom(alfabetID)
			}
		}

		// Store in the `actions` table
		if err := saveAction(ctx, action); err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     action,
				Operation: apperrors.QueryPost,
			}
		}

		// Update the SystemIntake in the DB
		intake, err := update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		// only send an email when everything went ok
		err = emailRequester(
			ctx,
			action.ActorEmail,
			intake.ID,
			intake.ProjectName.ValueOrZero(),
			isResubmitted,
		)
		if err != nil {
			appcontext.ZLogger(ctx).Error("submit intake email reviewer failed to send: ", zap.Error(err))
		}
		err = emailReviewer(
			ctx,
			intake.ID,
			intake.ProjectName.ValueOrZero(),
			intake.Requester,
			intake.Component.ValueOrZero(),
			intake.RequestType,
			intake.ProcessStatus.ValueOrZero(),
			isResubmitted,
		)
		if err != nil {
			appcontext.ZLogger(ctx).Error("submit intake email requester failed to send: ", zap.Error(err))
		}

		return nil
	}
}

// NewSubmitBusinessCase returns a function that
// executes submit of a business case
func NewSubmitBusinessCase(
	config Config,
	authorized func(context.Context, *models.SystemIntake) bool,
	fetchOpenBusinessCase func(context.Context, uuid.UUID) (*models.BusinessCaseWithCosts, error),
	validateForSubmit func(businessCase *models.BusinessCaseWithCosts) error,
	saveAction func(context.Context, *models.Action) error,
	updateIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	updateBusinessCase func(context.Context, *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error),
	emailRequester func(
		ctx context.Context,
		requesterEmail models.EmailAddress,
		requestName string,
		intakeID uuid.UUID,
		isResubmitted bool,
		isDraft bool,
	) error,
	emailReviewer func(
		ctx context.Context,
		intakeID uuid.UUID,
		requesterName string,
		requestName string,
		isResubmitted bool,
		isDraft bool,
	) error,
	submitToCEDAR func(ctx context.Context, bc models.BusinessCaseWithCosts) error,
) ActionExecuter {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		if !authorized(ctx, intake) {
			return &apperrors.UnauthorizedError{Err: errors.New("user is unauthorized to submit business case")}
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

		if intake.Step == models.SystemIntakeStepFINALBIZCASE {
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

		isResubmitted := false
		if (intake.Step == models.SystemIntakeStepDRAFTBIZCASE && intake.DraftBusinessCaseState == models.SIRFSEditsRequested) ||
			(intake.Step == models.SystemIntakeStepFINALBIZCASE && intake.FinalBusinessCaseState == models.SIRFSEditsRequested) {
			isResubmitted = true
		}
		isDraft := false
		if intake.Step == models.SystemIntakeStepDRAFTBIZCASE {
			isDraft = true
		}

		// Set intake state based on v2 logic
		if intake.Step == models.SystemIntakeStepDRAFTBIZCASE {
			intake.DraftBusinessCaseState = models.SIRFSSubmitted
		} else if intake.Step == models.SystemIntakeStepFINALBIZCASE {
			intake.FinalBusinessCaseState = models.SIRFSSubmitted
		}

		intake.UpdatedAt = &updatedAt
		intake, err = updateIntake(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		err = emailRequester(
			ctx,
			action.ActorEmail,
			intake.ProjectName.String,
			intake.ID,
			isResubmitted,
			isDraft,
		)
		if err != nil {
			appcontext.ZLogger(ctx).Error("Submit Business Case email failed to send: ", zap.Error(err))
		}
		err = emailReviewer(
			ctx,
			intake.ID,
			intake.Requester,
			intake.ProjectName.String,
			isResubmitted,
			isDraft,
		)
		if err != nil {
			appcontext.ZLogger(ctx).Error("Submit Business Case email failed to send: ", zap.Error(err))
		}

		// TODO - EASI-2363 - rework conditional to also trigger on publishing finalized system intakes
		if intake.Step == models.SystemIntakeStepDRAFTBIZCASE {
			err = submitToCEDAR(ctx, *businessCase)
			if err != nil {
				appcontext.ZLogger(ctx).Error("Submission to CEDAR failed", zap.Error(err))
			}
		}

		return nil
	}
}
