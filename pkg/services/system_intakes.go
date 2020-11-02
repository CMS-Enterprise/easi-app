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

// NewFetchSystemIntakes is a service to fetch multiple system intakes
// that are to be presented to the given requester
func NewFetchSystemIntakes(
	config Config,
	fetchByID func(c context.Context, euaID string) (models.SystemIntakes, error),
	fetchAll func(context.Context) (models.SystemIntakes, error),
	authorize func(c context.Context) (bool, error),
) func(c context.Context) (models.SystemIntakes, error) {
	return func(ctx context.Context) (models.SystemIntakes, error) {
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
			result, err = fetchAll(ctx)
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

// NewCreateSystemIntake is a service to create a business case
func NewCreateSystemIntake(
	config Config,
	create func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
) func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		if !principal.AllowEASi() {
			// Default to failure to authorize and create a quick audit log
			logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "CreateSystemIntake")).
				Info("something went wrong fetching the eua id from the context")
			return &models.SystemIntake{}, &apperrors.UnauthorizedError{}
		}
		intake.EUAUserID = principal.ID()
		// app validation belongs here
		createdIntake, err := create(ctx, intake)
		if err != nil {
			logger.Error("failed to create a system intake")
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QueryPost,
			}
		}
		return createdIntake, nil
	}
}

// NewUpdateSystemIntake is a service to update a system intake
func NewUpdateSystemIntake(
	config Config,
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	authorize func(context.Context, *models.SystemIntake) (bool, error),
	fetchRequesterInfo func(context.Context, string) (*models.UserInfo, error),
	sendReviewEmail func(emailText string, recipientAddress string) error,
	updateDraftIntake func(ctx context.Context, existing *models.SystemIntake, incoming *models.SystemIntake) (*models.SystemIntake, error),
	canDecideIntake bool,
) func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		existingIntake, fetchErr := fetch(ctx, intake.ID)
		if fetchErr != nil {
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     existingIntake,
			}
		}

		if existingIntake.Status == models.SystemIntakeStatusINTAKEDRAFT && intake.Status == models.SystemIntakeStatusINTAKEDRAFT {
			return updateDraftIntake(ctx, existingIntake, intake)
		} else if existingIntake.Status == models.SystemIntakeStatusINTAKESUBMITTED &&
			(intake.Status == models.SystemIntakeStatusAPPROVED ||
				intake.Status == models.SystemIntakeStatusACCEPTED ||
				intake.Status == models.SystemIntakeStatusCLOSED) && canDecideIntake {

			ok, err := authorize(ctx, existingIntake)
			if err != nil {
				return &models.SystemIntake{}, err
			}
			if !ok {
				return &models.SystemIntake{}, &apperrors.UnauthorizedError{Err: err}
			}

			updatedTime := config.clock.Now()
			intake.UpdatedAt = &updatedTime

			requesterInfo, err := fetchRequesterInfo(ctx, existingIntake.EUAUserID)
			if err != nil {
				return &models.SystemIntake{}, err
			}
			if requesterInfo == nil || requesterInfo.Email == "" {
				return &models.SystemIntake{}, &apperrors.ExternalAPIError{
					Err:       errors.New("user info fetch was not successful"),
					Model:     existingIntake,
					ModelID:   intake.ID.String(),
					Operation: apperrors.Fetch,
					Source:    "CEDAR LDAP",
				}
			}

			existingIntake.Status = intake.Status
			existingIntake.GrtReviewEmailBody = intake.GrtReviewEmailBody
			existingIntake.RequesterEmailAddress = null.StringFrom(requesterInfo.Email)
			existingIntake.DecidedAt = &updatedTime
			existingIntake.UpdatedAt = &updatedTime
			// This ensures only certain fields can be modified.
			intake, err = update(ctx, existingIntake)
			if err != nil {
				return &models.SystemIntake{}, &apperrors.QueryError{
					Err:       err,
					Model:     intake,
					Operation: apperrors.QuerySave,
				}
			}

			err = sendReviewEmail(intake.GrtReviewEmailBody.String, requesterInfo.Email)
			if err != nil {
				return &models.SystemIntake{}, err
			}

			return intake, nil
		} else {
			return &models.SystemIntake{}, &apperrors.ResourceConflictError{
				Err:        errors.New("invalid intake status change"),
				Resource:   intake,
				ResourceID: intake.ID.String(),
			}
		}
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

// NewAuthorizeArchiveSystemIntake returns a function
// that authorizes a user for archiving a system intake
func NewAuthorizeArchiveSystemIntake(logger *zap.Logger) func(
	c context.Context,
	i *models.SystemIntake,
) (bool, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		principal := appcontext.Principal(ctx)
		if !principal.AllowEASi() {
			logger.Error("unable to get EUA ID from context")
			return false, &apperrors.ContextError{
				Operation: apperrors.ContextGet,
				Object:    "EUA ID",
			}
		}

		// If intake doesn't exist or owned by user, authorize
		if intake == nil || principal.ID() == intake.EUAUserID {
			logger.With(zap.Bool("Authorized", true)).
				With(zap.String("Operation", "UpdateSystemIntake")).
				Info("user authorized to save system intake")
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			With(zap.String("Operation", "UpdateSystemIntake")).
			Info("unauthorized attempt to save system intake")
		return false, nil
	}
}

// NewArchiveSystemIntake is a service to archive a system intake
func NewArchiveSystemIntake(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	archiveBusinessCase func(context.Context, uuid.UUID) error,
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	sendWithdrawEmail func(requestName string) error,
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

		// We need to archive any associated business case
		if intake.BusinessCaseID != nil {
			err = archiveBusinessCase(ctx, *intake.BusinessCaseID)
			if err != nil {
				return err
			}
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.Status = models.SystemIntakeStatusARCHIVED
		intake.ArchivedAt = &updatedTime

		intake, err = update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		err = sendWithdrawEmail(intake.ProjectName.String)
		if err != nil {
			appcontext.ZLogger(ctx).Error("Withdraw email failed to send: ", zap.Error(err))
		}

		return nil
	}
}

// NewAuthorizeFetchSystemIntakeByID is a service to authorize FetchSystemIntakeByID
func NewAuthorizeFetchSystemIntakeByID() func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}
}

// NewFetchSystemIntakeByID is a service to fetch the system intake by intake id
func NewFetchSystemIntakeByID(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	authorize func(c context.Context, i *models.SystemIntake) (bool, error),
) func(c context.Context, u uuid.UUID) (*models.SystemIntake, error) {
	return func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		logger := appcontext.ZLogger(ctx)
		intake, err := fetch(ctx, id)
		if err != nil {
			logger.Error("failed to fetch system intake")
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QueryFetch,
			}
		}
		ok, err := authorize(ctx, intake)
		if err != nil {
			logger.Error("failed to authorize fetch system intake")
			return &models.SystemIntake{}, err
		}
		if !ok {
			return &models.SystemIntake{}, &apperrors.UnauthorizedError{Err: err}
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
	generateLCID func(context.Context) (string, error),
) func(context.Context, *models.SystemIntake) error {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		existing, err := fetch(ctx, intake.ID)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Operation: apperrors.QueryFetch,
				Model:     existing,
			}
		}

		ok, err := authorize(ctx)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}

		// don't allow overwriting an existing LCID
		if existing.LifecycleID.ValueOrZero() != "" {
			return &apperrors.ResourceConflictError{
				Err:        errors.New("lifecycle id already exists"),
				Resource:   models.SystemIntake{},
				ResourceID: intake.ID.String(),
			}
		}

		// we only want to bring over the fields specifically
		// dealing with lifecycleID information
		updatedTime := config.clock.Now()
		existing.UpdatedAt = &updatedTime
		existing.LifecycleID = intake.LifecycleID
		existing.LifecycleExpiresAt = intake.LifecycleExpiresAt
		existing.LifecycleScope = intake.LifecycleScope
		existing.LifecycleNextSteps = intake.LifecycleNextSteps

		// if a LCID wasn't passed in, we generate one
		if existing.LifecycleID.ValueOrZero() == "" {
			lcid, gErr := generateLCID(ctx)
			if gErr != nil {
				return gErr
			}
			existing.LifecycleID = null.StringFrom(lcid)
		}

		_, err = update(ctx, existing)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}
		return nil
	}
}
