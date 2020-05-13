package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/models"
)

// FetchBusinessCaseByID queries the DB for a business case matching the given ID
func (s *Store) FetchBusinessCaseByID(id uuid.UUID) (*models.BusinessCase, error) {
	businessCase := models.BusinessCase{}
	const fetchBusinessCaseSQL = `
		SELECT
			business_case.*,
			json_agg(estimated_lifecycle_cost) as lifecycle_cost_lines
		FROM
			business_case
			LEFT JOIN estimated_lifecycle_cost ON business_case.id = estimated_lifecycle_cost.business_case
		WHERE
			business_case.id = $1
		GROUP BY estimated_lifecycle_cost.business_case, business_case.id`

	err := s.DB.Get(&businessCase, fetchBusinessCaseSQL, id)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to fetch business case %s", err),
			zap.String("id", id.String()),
		)
		return &models.BusinessCase{}, err
	}
	return &businessCase, nil
}
