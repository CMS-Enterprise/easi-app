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

// NewCreateBusinessCase is a service to create a business case
func NewCreateBusinessCase(
	create func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
	logger *zap.Logger,
) func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	return func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		valid := validate.CheckUniqLifecycleCosts(businessCase.LifecycleCostLines)
		if !valid {
			err := apperrors.ValidationError{
				Err:         errors.New("there are duplicate lifecycle cost phases in a solution"),
				Model:       businessCase,
				ModelID:     "",
				Validations: apperrors.Validations{},
			}
			err.WithValidation(
				"LifecycleCostPhase",
				"cannot have multiple costs for the same phase, solution, and year",
			)
			return &models.BusinessCase{}, &err
		}
		businessCase, err := create(businessCase)
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
