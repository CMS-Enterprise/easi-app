package services

import (
	"context"
	"errors"
	"fmt"
	"time"

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
	submitToCEDAR func(context.Context, *models.SystemIntake) (string, error),
	saveAction func(context.Context, *models.Action) error,
	emailReviewer func(ctx context.Context, requestName string, intakeID uuid.UUID) error,
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

		// Send SystemIntake to CEDAR Intake API
		intake.SubmittedAt = &updatedTime
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

		// Store in the `actions` table
		err = saveAction(ctx, action)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     action,
				Operation: apperrors.QueryPost,
			}
		}

		// Update the SystemIntake in the DB
		intake, err = update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		// only send an email when everything went ok
		err = emailReviewer(ctx, intake.ProjectName.String, intake.ID)
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
	sendEmail func(ctx context.Context, requestName string, intakeID uuid.UUID) error,
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

		err = sendEmail(ctx, businessCase.ProjectName.String, businessCase.SystemIntakeID)
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
	sendReviewEmail func(ctx context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error,
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

		err = sendReviewEmail(ctx, action.Feedback.String, requesterInfo.Email, intake.ID)
		if err != nil {
			return err
		}

		return nil
	}
}

// NewCreateActionUpdateStatus returns a function that
// persists an action and updates a request
func NewCreateActionUpdateStatus(
	config Config,
	updateStatus func(c context.Context, id uuid.UUID, newStatus models.SystemIntakeStatus) (*models.SystemIntake, error),
	saveAction func(context.Context, *models.Action) error,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	sendReviewEmail func(ctx context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error,
	sendReviewEmailToMultipleRecipients func(ctx context.Context, emailText string, recipients models.EmailNotificationRecipients, intakeID uuid.UUID) error,
	sendIntakeInvalidEUAIDEmail func(ctx context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error,
	sendIntakeNoEUAIDEmail func(ctx context.Context, projectName string, intakeID uuid.UUID) error,
	closeBusinessCase func(context.Context, uuid.UUID) error,
) func(
	ctx context.Context,
	newAction *models.Action,
	intakeID uuid.UUID,
	newStatus models.SystemIntakeStatus,
	shouldCloseBusinessCase bool,
	shouldSendEmail bool,
	recipients *models.EmailNotificationRecipients,
) (*models.SystemIntake, error) {
	return func(
		ctx context.Context,
		action *models.Action,
		id uuid.UUID,
		newStatus models.SystemIntakeStatus,
		shouldCloseBusinessCase bool,
		shouldSendEmail bool,
		recipients *models.EmailNotificationRecipients,
	) (*models.SystemIntake, error) {
		err := saveAction(ctx, action)
		if err != nil {
			return nil, err
		}

		intake, err := updateStatus(ctx, id, newStatus)
		if err != nil {
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		if shouldCloseBusinessCase && intake.BusinessCaseID != nil {
			if err = closeBusinessCase(ctx, *intake.BusinessCaseID); err != nil {
				return nil, err
			}
		}

		// TODO - EASI-2021 - don't need this check with feature flag removed
		notifyMultipleRecipients := config.checkBoolFeatureFlag(ctx, notifyMultipleRecipientsFlagName, notifyMultipleRecipientsFlagDefault)

		// early return if we're not sending any emails
		// TODO - EASI-2021 - don't need this check with feature flag removed - shouldn't need this check
		if !shouldSendEmail && (!notifyMultipleRecipients || recipients == nil) {
			return intake, nil
		}

		// TODO - EASI-2021 - remove notifyMultipleRecipients check (but *not* recipients != nil check)
		if notifyMultipleRecipients && recipients != nil {
			err = sendReviewEmailToMultipleRecipients(ctx, action.Feedback.String, *recipients, intake.ID)
			if err != nil {
				return nil, err
			}
		} else { // TODO - EASI-2021 - remove this block
			euaID := intake.EUAUserID.ValueOrZero()
			requesterHasEUAID := euaID != ""
			requesterHasValidEUAID := requesterHasEUAID

			var requesterInfo *models.UserInfo
			if requesterHasEUAID {
				requesterInfo, err = fetchUserInfo(ctx, euaID)

				if err != nil {
					if _, ok := err.(*apperrors.InvalidEUAIDError); ok {
						appcontext.ZLogger(ctx).Info(fmt.Sprint("Intake ", intake.ID.String(), " has an invalid associated EUA ID; sending fallback email to governance team"),
							zap.String("intakeID", intake.ID.String()),
							zap.String("euaID", euaID))
						err = sendIntakeInvalidEUAIDEmail(ctx, intake.ProjectName.ValueOrZero(), euaID, intake.ID)
						if err != nil {
							return nil, err
						}

						requesterHasValidEUAID = false
					} else {
						return nil, err
					}
				} else if requesterInfo == nil || requesterInfo.Email == "" {
					appcontext.ZLogger(ctx).Error(fmt.Sprint("Requester info fetch for EUA ID ", euaID, " was not successful when submitting an action"),
						zap.String("intakeID", intake.ID.String()),
						zap.String("euaID", euaID))
					return nil, &apperrors.ExternalAPIError{
						Err:       errors.New("requester info fetch was not successful when submitting an action"),
						Model:     intake,
						ModelID:   intake.ID.String(),
						Operation: apperrors.Fetch,
						Source:    "CEDAR LDAP",
					}
				}
			} else {
				appcontext.ZLogger(ctx).Info(fmt.Sprint("Intake ", intake.ID.String(), " has no associated EUA ID; sending fallback email to governance team"),
					zap.String("intakeID", intake.ID.String()))
				err = sendIntakeNoEUAIDEmail(ctx, intake.ProjectName.ValueOrZero(), intake.ID)
				if err != nil {
					return nil, err
				}
			}

			if requesterHasValidEUAID {
				err = sendReviewEmail(ctx, action.Feedback.String, requesterInfo.Email, intake.ID)
				if err != nil {
					return nil, err
				}
			}
		}

		return intake, err
	}
}

// NewCreateActionExtendLifecycleID returns a function that
// persists an action and updates an intake's LCID
func NewCreateActionExtendLifecycleID(
	config Config,
	saveAction func(context.Context, *models.Action) error,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchSystemIntake func(context.Context, uuid.UUID) (*models.SystemIntake, error),
	updateSystemIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	sendExtendLCIDEmail func(ctx context.Context, recipient models.EmailAddress, systemIntakeID uuid.UUID, requestName string, newExpiresAt *time.Time, newScope string, newNextSteps string, newCostBaseline string) error,
	sendExtendLCIDEmailToMultipleRecipients func(ctx context.Context, recipients models.EmailNotificationRecipients, systemIntakeID uuid.UUID, requestName string, newExpiresAt *time.Time, newScope string, newNextSteps string, newCostBaseline string) error,
	sendIntakeInvalidEUAIDEmail func(ctx context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error,
	sendIntakeNoEUAIDEmail func(ctx context.Context, projectName string, intakeID uuid.UUID) error,
) func(ctx context.Context, action *models.Action, id uuid.UUID, expirationDate *time.Time, nextSteps *string, scope string, costBaseline *string, shouldSendEmail bool, recipients *models.EmailNotificationRecipients) (*models.SystemIntake, error) {
	return func(
		ctx context.Context,
		action *models.Action,
		id uuid.UUID,
		expirationDate *time.Time,
		nextSteps *string,
		scope string,
		costBaseline *string,
		shouldSendEmail bool,
		recipients *models.EmailNotificationRecipients,
	) (*models.SystemIntake, error) {
		intake, err := fetchSystemIntake(ctx, id)
		if err != nil {
			return nil, err
		}

		action.LCIDExpirationChangeNewDate = expirationDate
		action.LCIDExpirationChangePreviousDate = intake.LifecycleExpiresAt

		action.LCIDExpirationChangeNewScope = null.StringFrom(scope)
		action.LCIDExpirationChangePreviousScope = null.StringFrom(intake.LifecycleScope.String)

		action.LCIDExpirationChangeNewNextSteps = null.StringFromPtr(nextSteps)
		action.LCIDExpirationChangePreviousNextSteps = null.StringFrom(intake.DecisionNextSteps.String)

		action.LCIDExpirationChangeNewCostBaseline = null.StringFromPtr(costBaseline)
		action.LCIDExpirationChangePreviousCostBaseline = null.StringFrom(intake.LifecycleCostBaseline.String)

		actionErr := saveAction(ctx, action)
		if actionErr != nil {
			return nil, actionErr
		}

		intake.LifecycleExpiresAt = expirationDate
		intake.Status = models.SystemIntakeStatusLCIDISSUED
		intake.LifecycleScope = null.StringFrom(scope)
		intake.DecisionNextSteps = null.StringFromPtr(nextSteps)
		intake.LifecycleCostBaseline = null.StringFromPtr(costBaseline)

		_, updateErr := updateSystemIntake(ctx, intake)
		if updateErr != nil {
			return nil, updateErr
		}

		// TODO - EASI-2021 - don't need this check with feature flag removed
		notifyMultipleRecipients := config.checkBoolFeatureFlag(ctx, notifyMultipleRecipientsFlagName, notifyMultipleRecipientsFlagDefault)

		// TODO - EASI-2021 - remove notifyMultipleRecipients check (but *not* recipients != nil check)
		if notifyMultipleRecipients && recipients != nil {
			err = sendExtendLCIDEmailToMultipleRecipients(
				ctx,
				*recipients,
				id,
				intake.ProjectName.ValueOrZero(),
				expirationDate,
				intake.LifecycleScope.ValueOrZero(),
				intake.DecisionNextSteps.ValueOrZero(),
				intake.LifecycleCostBaseline.ValueOrZero(),
			)
			if err != nil {
				return nil, err
			}

			return intake, nil
		}

		// TODO - EASI-2021 - can remove this whole block
		if shouldSendEmail {
			euaID := intake.EUAUserID.ValueOrZero()
			requesterHasEUAID := euaID != ""
			requesterHasValidEUAID := requesterHasEUAID

			var requesterInfo *models.UserInfo
			if requesterHasEUAID {
				requesterInfo, err = fetchUserInfo(ctx, euaID)

				if err != nil {
					if _, ok := err.(*apperrors.InvalidEUAIDError); ok {
						appcontext.ZLogger(ctx).Info(fmt.Sprint("Intake ", intake.ID.String(), " has an invalid associated EUA ID; sending fallback email to governance team"),
							zap.String("intakeID", intake.ID.String()),
							zap.String("euaID", euaID))
						err = sendIntakeInvalidEUAIDEmail(ctx, intake.ProjectName.ValueOrZero(), euaID, intake.ID)
						if err != nil {
							return nil, err
						}

						requesterHasValidEUAID = false
					} else {
						return nil, err
					}
				} else if requesterInfo == nil || requesterInfo.Email == "" {
					appcontext.ZLogger(ctx).Error(fmt.Sprint("Requester info fetch for EUA ID ", euaID, " was not successful when submitting an action"),
						zap.String("intakeID", intake.ID.String()),
						zap.String("euaID", euaID))
					return nil, &apperrors.ExternalAPIError{
						Err:       errors.New("requester info fetch was not successful when submitting an action"),
						Model:     intake,
						ModelID:   intake.ID.String(),
						Operation: apperrors.Fetch,
						Source:    "CEDAR LDAP",
					}
				}
			} else {
				appcontext.ZLogger(ctx).Info(fmt.Sprint("Intake ", intake.ID.String(), " has no associated EUA ID; sending fallback email to governance team"),
					zap.String("intakeID", intake.ID.String()))
				err = sendIntakeNoEUAIDEmail(ctx, intake.ProjectName.ValueOrZero(), intake.ID)
				if err != nil {
					return nil, err
				}
			}

			if requesterHasValidEUAID {
				err = sendExtendLCIDEmail(
					ctx,
					requesterInfo.Email,
					id,
					intake.ProjectName.String,
					expirationDate,
					scope,
					intake.DecisionNextSteps.ValueOrZero(),
					intake.LifecycleCostBaseline.ValueOrZero(),
				)

				if err != nil {
					return nil, err
				}
			}
		}

		return intake, nil
	}
}
