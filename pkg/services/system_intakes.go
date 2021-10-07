package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchSystemIntakes is a service to fetch multiple system intakes
// that are to be presented to the given requester
func NewFetchSystemIntakes(
	config Config,
	fetchByID func(c context.Context, euaID string) (models.SystemIntakes, error),
	fetchAll func(context.Context) (models.SystemIntakes, error),
	fetchByStatusFilter func(context.Context, []models.SystemIntakeStatus) (models.SystemIntakes, error),
	authorize func(c context.Context) (bool, error),
) func(context.Context, models.SystemIntakeStatusFilter) (models.SystemIntakes, error) {
	return func(ctx context.Context, statusFilter models.SystemIntakeStatusFilter) (models.SystemIntakes, error) {
		logger := appcontext.ZLogger(ctx)
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: errors.New("failed to authorize fetch system intakes")}
		}
		var result models.SystemIntakes
		principal := appcontext.Principal(ctx)
		if !principal.AllowGRT() {
			result, err = fetchByID(ctx, principal.ID())
		} else {
			if statusFilter == "" {
				result, err = fetchAll(ctx)
			} else {
				statuses, filterErr := models.GetStatusesByFilter(statusFilter)
				if filterErr != nil {
					return nil, &apperrors.BadRequestError{
						Err: filterErr,
					}
				}
				result, err = fetchByStatusFilter(ctx, statuses)
			}
		}
		if err != nil {
			logger.Error("failed to fetch system intakes")
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     result,
				Operation: apperrors.QueryFetch,
			}
		}
		return result, nil
	}
}

// NewUpdateSystemIntake is a service to update a system intake
func NewUpdateSystemIntake(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	authorize func(context.Context, *models.SystemIntake) (bool, error),
) func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		existingIntake, err := fetch(ctx, intake.ID)
		if err != nil {
			return nil, &apperrors.ResourceNotFoundError{
				Err:      errors.New("business case does not exist"),
				Resource: intake,
			}
		}

		ok, err := authorize(ctx, existingIntake)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: err}
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime

		intake, err = update(ctx, intake)
		if err != nil {
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		return intake, nil
	}
}

// NewUpdateDraftSystemIntake returns a function that
// executes update of a system intake in Draft
func NewUpdateDraftSystemIntake(
	config Config,
	authorize func(context.Context, *models.SystemIntake) (bool, error),
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
) func(context.Context, *models.SystemIntake, *models.SystemIntake) (*models.SystemIntake, error) {
	return func(ctx context.Context, existing *models.SystemIntake, incoming *models.SystemIntake) (*models.SystemIntake, error) {
		ok, err := authorize(ctx, existing)
		if err != nil {
			return &models.SystemIntake{}, err
		}
		if !ok {
			return &models.SystemIntake{}, &apperrors.UnauthorizedError{Err: err}
		}

		updatedTime := config.clock.Now()
		incoming.UpdatedAt = &updatedTime
		incoming, err = update(ctx, incoming)
		if err != nil {
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     incoming,
				Operation: apperrors.QuerySave,
			}
		}
		return incoming, nil
	}
}

// NewArchiveSystemIntake is a service to archive a system intake
func NewArchiveSystemIntake(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	closeBusinessCase func(context.Context, uuid.UUID) error,
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	sendWithdrawEmail func(ctx context.Context, requestName string) error,
) func(context.Context, uuid.UUID) error {
	return func(ctx context.Context, id uuid.UUID) error {
		intake, fetchErr := fetch(ctx, id)
		if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     intake,
			}
		}
		ok, err := authorize(ctx, intake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		// We need to close any associated business case
		if intake.BusinessCaseID != nil {
			err = closeBusinessCase(ctx, *intake.BusinessCaseID)
			if err != nil {
				return err
			}
		}

		initialStatus := intake.Status

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = models.SystemIntakeStatusWITHDRAWN
		intake.ArchivedAt = &updatedTime

		intake, err = update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		// Do note send email if intake was in a draft state (not submitted)
		if initialStatus != models.SystemIntakeStatusINTAKEDRAFT {
			err = sendWithdrawEmail(ctx, intake.ProjectName.String)
			if err != nil {
				appcontext.ZLogger(ctx).Error("Withdraw email failed to send: ", zap.Error(err))
			}
		}

		return nil
	}
}

// NewFetchSystemIntakeByID is a service to fetch the system intake by intake id
func NewFetchSystemIntakeByID(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	authorize func(context.Context) (bool, error),
) func(c context.Context, u uuid.UUID) (*models.SystemIntake, error) {
	return func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		logger := appcontext.ZLogger(ctx)
		intake, err := fetch(ctx, id)
		if err != nil {
			logger.Info("failed to fetch system intake", zap.Error(err))
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QueryFetch,
			}
		}
		ok, err := authorize(ctx)
		if err != nil {
			logger.Info("failed to authorize fetch system intake", zap.Error(err))
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: err}
		}
		return intake, nil
	}
}

// NewUpdateLifecycleFields provides a way to update several of the fields
// associated with assigning a LifecycleID
func NewUpdateLifecycleFields(
	config Config,
	authorize func(context.Context) (bool, error),
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	saveAction func(context.Context, *models.Action) error,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	sendIssueLCIDEmail func(context.Context, models.EmailAddress, string, *time.Time, string, string, string) error,
	generateLCID func(context.Context) (string, error),
) func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error) {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) (*models.SystemIntake, error) {
		existing, err := fetch(ctx, intake.ID)
		if err != nil {
			return nil, &apperrors.QueryError{
				Err:       err,
				Operation: apperrors.QueryFetch,
				Model:     existing,
			}
		}

		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: err}
		}

		// don't allow overwriting an existing LCID
		if existing.LifecycleID.ValueOrZero() != "" {
			return nil, &apperrors.ResourceConflictError{
				Err:        errors.New("lifecycle id already exists"),
				Resource:   models.SystemIntake{},
				ResourceID: existing.ID.String(),
			}
		}

		requesterInfo, err := fetchUserInfo(ctx, existing.EUAUserID.ValueOrZero())
		if err != nil {
			return nil, err
		}
		if requesterInfo == nil || requesterInfo.Email == "" {
			return nil, &apperrors.ExternalAPIError{
				Err:       errors.New("requester info fetch was not successful when submitting an action"),
				Model:     existing,
				ModelID:   existing.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		// we only want to bring over the fields specifically
		// dealing with lifecycleID information
		updatedTime := config.clock.Now()
		existing.UpdatedAt = &updatedTime
		existing.LifecycleID = intake.LifecycleID
		existing.LifecycleExpiresAt = intake.LifecycleExpiresAt
		existing.LifecycleScope = intake.LifecycleScope
		existing.DecisionNextSteps = intake.DecisionNextSteps
		existing.LifecycleCostBaseline = intake.LifecycleCostBaseline

		// if a LCID wasn't passed in, we generate one
		if existing.LifecycleID.ValueOrZero() == "" {
			lcid, gErr := generateLCID(ctx)
			if gErr != nil {
				return nil, gErr
			}
			existing.LifecycleID = null.StringFrom(lcid)
		}

		action.IntakeID = &existing.ID
		action.ActionType = models.ActionTypeISSUELCID
		if err = saveAction(ctx, action); err != nil {
			return nil, err
		}

		existing.Status = models.SystemIntakeStatusLCIDISSUED
		updated, err := update(ctx, existing)
		if err != nil {
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		// TODO: put cost baseline in email?
		err = sendIssueLCIDEmail(
			ctx,
			requesterInfo.Email,
			updated.LifecycleID.String,
			updated.LifecycleExpiresAt,
			updated.LifecycleScope.String,
			updated.DecisionNextSteps.String,
			action.Feedback.String)
		if err != nil {
			return nil, err
		}

		return updated, nil

	}
}

// NewUpdateRejectionFields provides a way to update several of the fields
// associated with rejecting an intake request
func NewUpdateRejectionFields(
	config Config,
	authorize func(context.Context) (bool, error),
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	saveAction func(context.Context, *models.Action) error,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	sendRejectRequestEmail func(ctx context.Context, recipient models.EmailAddress, reason string, nextSteps string, feedback string) error,
) func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error) {
	return func(ctx context.Context, intake *models.SystemIntake, action *models.Action) (*models.SystemIntake, error) {
		existing, err := fetch(ctx, intake.ID)
		if err != nil {
			return nil, err
		}

		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}
		if !ok {
			return nil, &apperrors.UnauthorizedError{Err: err}
		}

		requesterInfo, err := fetchUserInfo(ctx, existing.EUAUserID.ValueOrZero())
		if err != nil {
			return nil, err
		}
		if requesterInfo == nil || requesterInfo.Email == "" {
			return nil, &apperrors.ExternalAPIError{
				Err:       errors.New("requester info fetch was not successful when submitting an action"),
				Model:     existing,
				ModelID:   existing.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		action.IntakeID = &existing.ID
		action.ActionType = models.ActionTypeREJECT
		if err = saveAction(ctx, action); err != nil {
			return nil, err
		}

		// we only want to bring over the fields specifically
		// dealing with Rejection information
		updatedTime := config.clock.Now()
		existing.UpdatedAt = &updatedTime
		existing.RejectionReason = intake.RejectionReason
		existing.DecisionNextSteps = intake.DecisionNextSteps
		existing.Status = models.SystemIntakeStatusNOTAPPROVED
		updated, err := update(ctx, existing)
		if err != nil {
			return nil, err
		}

		err = sendRejectRequestEmail(
			ctx,
			requesterInfo.Email,
			existing.RejectionReason.String,
			existing.DecisionNextSteps.String,
			action.Feedback.String,
		)
		if err != nil {
			return nil, err
		}

		return updated, nil
	}
}

// NewProvideGRTFeedback gives a function to provide GRT Feedback to an intake
func NewProvideGRTFeedback(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	saveAction func(context.Context, *models.Action) error,
	saveGRTFeedback func(context.Context, *models.GRTFeedback) (*models.GRTFeedback, error),
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	sendReviewEmail func(ctx context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error,
) func(context.Context, *models.GRTFeedback, *models.Action, models.SystemIntakeStatus) (*models.GRTFeedback, error) {
	return func(ctx context.Context, grtFeedback *models.GRTFeedback, action *models.Action, newStatus models.SystemIntakeStatus) (*models.GRTFeedback, error) {
		intake, err := fetch(ctx, grtFeedback.IntakeID)
		if err != nil {
			return nil, err
		}

		requesterInfo, err := fetchUserInfo(ctx, intake.EUAUserID.ValueOrZero())
		if err != nil {
			return nil, err
		}
		if requesterInfo == nil || requesterInfo.Email == "" {
			return nil, &apperrors.ExternalAPIError{
				Err:       errors.New("requester info fetch was not successful when submitting GRT Feedback"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		if grtFeedback, err = saveGRTFeedback(ctx, grtFeedback); err != nil {
			return nil, err
		}

		if err = saveAction(ctx, action); err != nil {
			return nil, err
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = newStatus
		intake, err = update(ctx, intake)
		if err != nil {
			return nil, err
		}

		err = sendReviewEmail(
			ctx,
			action.Feedback.String,
			requesterInfo.Email,
			intake.ID,
		)
		if err != nil {
			return nil, err
		}

		return grtFeedback, nil
	}
}
