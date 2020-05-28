package services

import (
	"context"
	"errors"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/appvalidation"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchBusinessCaseByID is a service to fetch the business case by id
func NewFetchBusinessCaseByID(
	fetch func(id uuid.UUID) (*models.BusinessCase, error),
	logger *zap.Logger,
) func(id uuid.UUID) (*models.BusinessCase, error) {
	return func(id uuid.UUID) (*models.BusinessCase, error) {
		businessCase, err := fetch(id)
		if err != nil {
			logger.Error("failed to fetch business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryFetch,
			}
		}
		return businessCase, nil
	}
}

// NewAuthorizeCreateBusinessCase returns a function
// that authorizes a user for creating a business case
func NewAuthorizeCreateBusinessCase(logger *zap.Logger) func(
	context context.Context,
	intake *models.SystemIntake,
) (bool, error) {
	return func(context context.Context, intake *models.SystemIntake) (bool, error) {
		if intake == nil {
			logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "CreateBusinessCase")).
				Info("intake does not exist")
			return false, nil
		}
		user, ok := appcontext.User(context)
		if !ok {
			// Default to failure to authorize and create a quick audit log
			logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "CreateBusinessCase")).
				Info("something went wrong fetching the eua id from the context")
			return false, nil
		}
		// If business case is owned by user, authorize
		if user.EUAUserID == intake.EUAUserID {
			logger.With(zap.Bool("Authorized", true)).
				With(zap.String("Operation", "CreateBusinessCase")).
				Info("user authorized to create business case")
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			With(zap.String("Operation", "CreateBusinessCase")).
			Info("unauthorized attempt to create business case")
		return false, nil
	}
}

// NewCreateBusinessCase is a service to create a business case
func NewCreateBusinessCase(
	fetchIntake func(id uuid.UUID) (*models.SystemIntake, error),
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	create func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
	logger *zap.Logger,
	clock clock.Clock,
) func(context context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	return func(context context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		intake, err := fetchIntake(businessCase.SystemIntakeID)
		if err != nil {
			// We return an empty id in this error because the business case hasn't been created
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("system intake is required to create a business case"),
				Resource:   models.BusinessCase{},
				ResourceID: "",
			}
		}
		ok, err := authorize(context, intake)
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
		createAt := clock.Now()
		businessCase.CreatedAt = &createAt
		businessCase.UpdatedAt = &createAt
		businessCase, err = create(businessCase)
		if err != nil {
			logger.Error("failed to create a business case")
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
	fetch func(euaID string) (models.BusinessCases, error),
	logger *zap.Logger,
) func(euaID string) (models.BusinessCases, error) {
	return func(euaID string) (models.BusinessCases, error) {
		businessCases, err := fetch(euaID)
		if err != nil {
			logger.Error("failed to fetch business cases")
			return models.BusinessCases{}, &apperrors.QueryError{
				Err:       err,
				Model:     "business cases",
				Operation: "fetch",
			}
		}
		return businessCases, nil
	}
}

// NewAuthorizeUpdateBusinessCase returns a function
// that authorizes a user for updating an existing business case
func NewAuthorizeUpdateBusinessCase(logger *zap.Logger) func(
	context context.Context,
	businessCase *models.BusinessCase,
) (bool, error) {
	return func(context context.Context, businessCase *models.BusinessCase) (bool, error) {
		if businessCase == nil {
			logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "UpdateBusinessCase")).
				Info("business case does not exist")
			return false, nil
		}
		user, ok := appcontext.User(context)
		if !ok {
			// Default to failure to authorize and create a quick audit log
			logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "UpdateBusinessCase")).
				Info("something went wrong fetching the eua id from the context")
			return false, nil
		}
		// If intake is owned by user, authorize
		if user.EUAUserID == businessCase.EUAUserID {
			logger.With(zap.Bool("Authorized", true)).
				With(zap.String("Operation", "UpdateBusinessCase")).
				Info("user authorized to update business case")
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			With(zap.String("Operation", "UpdateBusinessCase")).
			Info("unauthorized attempt to update business case")
		return false, nil
	}
}

// NewUpdateBusinessCase is a service to create a business case
func NewUpdateBusinessCase(
	fetchBusinessCase func(id uuid.UUID) (*models.BusinessCase, error),
	authorize func(context context.Context, businessCase *models.BusinessCase) (bool, error),
	update func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
	sendEmail func(requester string, intakeID uuid.UUID) error,
	logger *zap.Logger,
	clock clock.Clock,
) func(context context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	return func(context context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		existingBusinessCase, err := fetchBusinessCase(businessCase.ID)
		if err != nil {
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("business case does not exist"),
				Resource:   businessCase,
				ResourceID: businessCase.ID.String(),
			}
		}
		ok, err := authorize(context, existingBusinessCase)
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
		updatedAt := clock.Now()
		businessCase.UpdatedAt = &updatedAt
		businessCase, err = update(businessCase)
		if err != nil {
			logger.Error("failed to update business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}
		// Right now, add some validations for sending an email here
		// Similar to system intake,
		// these should be covered by validations above
		if businessCase.Status == models.BusinessCaseStatusSUBMITTED &&
			existingBusinessCase.Status == models.BusinessCaseStatusDRAFT {
			if !businessCase.Requester.Valid {
				validationError := apperrors.NewValidationError(
					errors.New("failed to validate for email"),
					businessCase,
					businessCase.ID.String(),
				)
				validationError.WithValidation("Requester", "is required")
				logger.Error("Failed to validate", zap.Error(&validationError))
				return businessCase, &validationError
			}
			err = sendEmail(businessCase.Requester.String, businessCase.ID)
			if err != nil {
				logger.Error("Failed to send email", zap.Error(err))
				return businessCase, err
			}
		}
		return businessCase, nil
	}
}
