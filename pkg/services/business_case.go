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

// NewAuthorizeFetchBusinessCaseByID is a service to authorize FetchBusinessCaseByID
func NewAuthorizeFetchBusinessCaseByID() func(ctx context.Context, businessCase *models.BusinessCase) (bool, error) {
	return func(ctx context.Context, businessCase *models.BusinessCase) (bool, error) {
		return true, nil
	}
}

// NewFetchBusinessCaseByID is a service to fetch the business case by id
func NewFetchBusinessCaseByID(
	config Config,
	fetch func(id uuid.UUID) (*models.BusinessCase, error),
	authorize func(context context.Context, businessCase *models.BusinessCase) (bool, error),
) func(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error) {
	return func(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error) {
		businessCase, err := fetch(id)
		if err != nil {
			config.logger.Error("failed to fetch business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryFetch,
			}
		}
		ok, err := authorize(ctx, businessCase)
		if err != nil {
			config.logger.Error("failed to authorize fetch business case")
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
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
	config Config,
	fetchIntake func(id uuid.UUID) (*models.SystemIntake, error),
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	create func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
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
		// Autofill time and intake data
		createAt := config.clock.Now()
		businessCase.CreatedAt = &createAt
		businessCase.UpdatedAt = &createAt
		businessCase.Requester = null.StringFrom(intake.Requester)
		businessCase.BusinessOwner = intake.BusinessOwner
		businessCase.ProjectName = intake.ProjectName
		businessCase.BusinessNeed = intake.BusinessNeed

		businessCase, err = create(businessCase)
		if err != nil {
			config.logger.Error("failed to create a business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryPost,
			}
		}
		return businessCase, nil
	}
}

// NewAuthorizeFetchBusinessCasesByEuaID is a service to authorize FetchBusinessCasesByEuaID
func NewAuthorizeFetchBusinessCasesByEuaID() func(ctx context.Context, euaID string) (bool, error) {
	return func(ctx context.Context, euaID string) (bool, error) {
		return true, nil
	}
}

// NewFetchBusinessCasesByEuaID is a service to fetch a list of business cases by EUA ID
func NewFetchBusinessCasesByEuaID(
	config Config,
	fetch func(euaID string) (models.BusinessCases, error),
	authorize func(context context.Context, euaID string) (bool, error),
) func(ctx context.Context, euaID string) (models.BusinessCases, error) {
	return func(ctx context.Context, euaID string) (models.BusinessCases, error) {
		ok, err := authorize(ctx, euaID)
		if err != nil {
			config.logger.Error("failed to authorize fetch system intakes")
			return models.BusinessCases{}, err
		}
		if !ok {
			return models.BusinessCases{}, &apperrors.UnauthorizedError{Err: err}
		}
		businessCases, err := fetch(euaID)
		if err != nil {
			config.logger.Error("failed to fetch business cases")
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
	config Config,
	fetchBusinessCase func(id uuid.UUID) (*models.BusinessCase, error),
	authorize func(context context.Context, businessCase *models.BusinessCase) (bool, error),
	update func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
	sendEmail func(requester string, intakeID uuid.UUID) error,
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
		updatedAt := config.clock.Now()
		businessCase.UpdatedAt = &updatedAt

		// Once CEDAR endpoint exists, we should be doing validations and submissions in the CEDAR package
		if businessCase.Status == models.BusinessCaseStatusSUBMITTED &&
			existingBusinessCase.Status == models.BusinessCaseStatusDRAFT {
			// Set submitted at time before validations as it is one of the fields that is validated
			businessCase.SubmittedAt = businessCase.UpdatedAt
			err = appvalidation.BusinessCaseForSubmit(businessCase, existingBusinessCase)
			if err != nil {
				config.logger.Error("Failed to validate", zap.Error(err))
				return businessCase, err
			}
		}

		businessCase, err = update(businessCase)
		if err != nil {
			config.logger.Error("failed to update business case")
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
				config.logger.Error("Failed to send email", zap.Error(err))
				return businessCase, err
			}
		}
		return businessCase, nil
	}
}

// NewArchiveBusinessCase is a service to archive a businessCase
func NewArchiveBusinessCase(
	config Config,
	fetch func(id uuid.UUID) (*models.BusinessCase, error),
	update func(*models.BusinessCase) (*models.BusinessCase, error),
) func(context.Context, uuid.UUID) error {
	return func(ctx context.Context, id uuid.UUID) error {
		businessCase, fetchErr := fetch(id)
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

		_, err := update(businessCase)
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
