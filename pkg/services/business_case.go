package services

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
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

// NewFetchBusinessCaseByID is a service to fetch the business case by id
func NewCreateBusinessCase(
	create func(businessCase *models.BusinessCase) (*models.BusinessCase, error),
	logger *zap.Logger,
) func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	return func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		id := uuid.New()
		businessCase.ID = id
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
