package services

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/validate"
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
	businessCase *models.BusinessCase,
	intake *models.SystemIntake,
) (bool, error) {
	return func(businessCase *models.BusinessCase, intake *models.SystemIntake) (bool, error) {
		if intake == nil || businessCase == nil {
			logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "CreateBusinessCase")).
				Info("intake or business case were not created")
			return false, nil
		}
		// If intake is owned by user, authorize
		if businessCase.EUAUserID != "" && businessCase.EUAUserID == intake.EUAUserID {
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
	authorize func(businessCase *models.BusinessCase, intake *models.SystemIntake) (bool, error),
	create func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
	logger *zap.Logger,
) func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	return func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		intake, err := fetchIntake(businessCase.SystemIntakeID)
		if err != nil {
			// We return an empty id in this error because the business case hasn't been created
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("system intake is required to create a business case"),
				Resource:   models.BusinessCase{},
				ResourceID: "",
			}
		}
		ok, err := authorize(businessCase, intake)
		if err != nil {
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		err = validate.BusinessCaseForCreation(businessCase, intake)
		if err != nil {
			return &models.BusinessCase{}, err
		}
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
