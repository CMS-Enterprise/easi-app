package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/appvalidation"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchBusinessCaseByID is a service to fetch the business case by id
func NewFetchBusinessCaseByID(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.BusinessCase, error),
	authorize func(context.Context) (bool, error),
) func(c context.Context, id uuid.UUID) (*models.BusinessCase, error) {
	return func(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error) {
		logger := appcontext.ZLogger(ctx)
		businessCase, err := fetch(ctx, id)
		if err != nil {
			logger.Error("failed to fetch business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryFetch,
			}
		}
		ok, err := authorize(ctx)
		if err != nil {
			logger.Error("failed to authorize fetch business case")
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		return businessCase, nil
	}
}

// NewCreateBusinessCase is a service to create a business case
func NewCreateBusinessCase(
	config Config,
	fetchIntake func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	authorize func(c context.Context, i *models.SystemIntake) (bool, error),
	create func(c context.Context, b *models.BusinessCase) (*models.BusinessCase, error),
) func(c context.Context, b *models.BusinessCase) (*models.BusinessCase, error) {
	return func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		intake, err := fetchIntake(ctx, businessCase.SystemIntakeID)
		if err != nil {
			// We return an empty id in this error because the business case hasn't been created
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("system intake is required to create a business case"),
				Resource:   models.BusinessCase{},
				ResourceID: "",
			}
		}
		ok, err := authorize(ctx, intake)
		if err != nil {
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		err = appvalidation.BusinessCaseForCreation(businessCase, intake)
		if err != nil {
			return &models.BusinessCase{}, err
		}
		// Autofill time and intake data
		createAt := config.clock.Now()
		businessCase.CreatedAt = &createAt
		businessCase.UpdatedAt = &createAt
		businessCase.Requester = null.StringFrom(intake.Requester)
		businessCase.BusinessOwner = intake.BusinessOwner
		businessCase.ProjectName = intake.ProjectName
		businessCase.BusinessNeed = intake.BusinessNeed

		businessCase, err = create(ctx, businessCase)
		if err != nil {
			appcontext.ZLogger(ctx).Error("failed to create a business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryPost,
			}
		}
		return businessCase, nil
	}
}

// NewFetchBusinessCasesByEuaID is a service to fetch a list of business cases by EUA ID
func NewFetchBusinessCasesByEuaID(
	config Config,
	fetch func(c context.Context, euaID string) (models.BusinessCases, error),
	authorize func(c context.Context) (bool, error),
) func(c context.Context, euaID string) (models.BusinessCases, error) {
	return func(ctx context.Context, euaID string) (models.BusinessCases, error) {
		ok, err := authorize(ctx)
		if err != nil {
			appcontext.ZLogger(ctx).Error("failed to authorize fetch system intakes")
			return models.BusinessCases{}, err
		}
		if !ok {
			return models.BusinessCases{}, &apperrors.UnauthorizedError{Err: err}
		}
		businessCases, err := fetch(ctx, euaID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("failed to fetch business cases")
			return models.BusinessCases{}, &apperrors.QueryError{
				Err:       err,
				Model:     "business cases",
				Operation: "fetch",
			}
		}
		return businessCases, nil
	}
}

// NewUpdateBusinessCase is a service to create a business case
func NewUpdateBusinessCase(
	config Config,
	fetchBusinessCase func(c context.Context, id uuid.UUID) (*models.BusinessCase, error),
	authorize func(c context.Context, b *models.BusinessCase) (bool, error),
	update func(c context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error),
	sendEmail func(requester string, intakeID uuid.UUID) error,
) func(c context.Context, b *models.BusinessCase) (*models.BusinessCase, error) {
	return func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		logger := appcontext.ZLogger(ctx)
		existingBusinessCase, err := fetchBusinessCase(ctx, businessCase.ID)
		if err != nil {
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("business case does not exist"),
				Resource:   businessCase,
				ResourceID: businessCase.ID.String(),
			}
		}
		ok, err := authorize(ctx, existingBusinessCase)
		if err != nil {
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		// Uncomment below when UI has changed for unique lifecycle costs
		//err = appvalidation.BusinessCaseForUpdate(businessCase)
		//if err != nil {
		//	return &models.BusinessCase{}, err
		//}
		updatedAt := config.clock.Now()
		businessCase.UpdatedAt = &updatedAt

		// Once CEDAR endpoint exists, we should be doing validations and submissions in the CEDAR package
		if businessCase.Status == models.BusinessCaseStatusSUBMITTED &&
			existingBusinessCase.Status == models.BusinessCaseStatusDRAFT {
			// Set submitted at times before validations as it is one of the fields that is validated
			if businessCase.InitialSubmittedAt == nil {
				businessCase.InitialSubmittedAt = &updatedAt
			}
			businessCase.LastSubmittedAt = &updatedAt
			err = appvalidation.BusinessCaseForSubmit(businessCase, existingBusinessCase)
			if err != nil {
				logger.Error("Failed to validate", zap.Error(err))
				return businessCase, err
			}
		}

		businessCase, err = update(ctx, businessCase)
		if err != nil {
			logger.Error("failed to update business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		// At this point, if everything has gone well, email the GRT
		if businessCase.Status == models.BusinessCaseStatusSUBMITTED &&
			existingBusinessCase.Status == models.BusinessCaseStatusDRAFT {
			err = sendEmail(businessCase.Requester.String, businessCase.ID)
			if err != nil {
				logger.Error("Failed to send email", zap.Error(err))
				return businessCase, err
			}
		}
		return businessCase, nil
	}
}

// NewArchiveBusinessCase is a service to archive a businessCase
func NewArchiveBusinessCase(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.BusinessCase, error),
	update func(context.Context, *models.BusinessCase) (*models.BusinessCase, error),
) func(context.Context, uuid.UUID) error {
	return func(ctx context.Context, id uuid.UUID) error {
		businessCase, fetchErr := fetch(ctx, id)
		if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     businessCase,
			}
		}

		updatedTime := config.clock.Now()
		businessCase.UpdatedAt = &updatedTime
		businessCase.Status = models.BusinessCaseStatusARCHIVED
		businessCase.ArchivedAt = &updatedTime

		_, err := update(ctx, businessCase)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		return nil
	}
}
