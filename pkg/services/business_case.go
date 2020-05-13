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
				Model:     "business case",
				Operation: "fetch",
			}
		}
		return businessCase, nil
	}
}
