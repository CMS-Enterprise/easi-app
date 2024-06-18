package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// NewFetchSystemIntakes is a service to fetch multiple system intakes
// that are to be presented to the given requester
func NewFetchSystemIntakes(
	config Config,
	fetchByID func(c context.Context, euaID string) (models.SystemIntakes, error),
	fetchAll func(context.Context) (models.SystemIntakes, error),
	authorize func(c context.Context) (bool, error),
) func(context.Context) (models.SystemIntakes, error) {
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

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
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
		if intake.SubmittedAt != nil {
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
