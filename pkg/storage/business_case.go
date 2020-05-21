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

// FetchBusinessCasesByEuaID queries the DB for a list of business case matching the given EUA ID
func (s *Store) FetchBusinessCasesByEuaID(euaID string) (models.BusinessCases, error) {
	businessCases := []models.BusinessCase{}
	const fetchBusinessCaseSQL = `
		SELECT
			business_case.*,
			json_agg(estimated_lifecycle_cost) as lifecycle_cost_lines
		FROM
			business_case
			LEFT JOIN estimated_lifecycle_cost ON business_case.id = estimated_lifecycle_cost.business_case
		WHERE
			business_case.eua_user_id = $1
		GROUP BY estimated_lifecycle_cost.business_case, business_case.id`

	err := s.DB.Select(&businessCases, fetchBusinessCaseSQL, euaID)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to fetch business cases %s", err),
			zap.String("euaID", euaID),
		)
		return models.BusinessCases{}, err
	}
	return businessCases, nil
}

const createEstimatedLifecycleCostSQL = `
	INSERT INTO estimated_lifecycle_cost (
		id,
		business_case,
		solution,
		year,
		phase,
		cost
	)
	VALUES (
		:id,
		:business_case,
		:solution,
		:year,
		:phase,
		:cost
	)
`

// CreateBusinessCase creates a business case
func (s *Store) CreateBusinessCase(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	id := uuid.New()
	businessCase.ID = id
	const createBusinessCaseSQL = `
		INSERT INTO business_case (
			id,
			eua_user_id,
			system_intake,
			project_name,
			requester,
			requester_phone_number,
			business_owner,
			business_need,
			cms_benefit,
			priority_alignment,
			success_indicators,
			as_is_title,
			as_is_summary,
			as_is_pros,
			as_is_cons,
			as_is_cost_savings,
			preferred_title,
			preferred_summary,
			preferred_acquisition_approach,
			preferred_pros,
			preferred_cons,
			preferred_cost_savings,
			alternative_a_title,
			alternative_a_summary,
			alternative_a_acquisition_approach,
			alternative_a_pros,
			alternative_a_cons,
			alternative_a_cost_savings,
			alternative_b_title,
			alternative_b_summary,
			alternative_b_acquisition_approach,
			alternative_b_pros,
			alternative_b_cons,
			alternative_b_cost_savings,
		    created_at,
			updated_at
		)
		VALUES (
			:id,
			:eua_user_id,
			:system_intake,
			:project_name,
			:requester,
			:requester_phone_number,
			:business_owner,
			:business_need,
			:cms_benefit,
			:priority_alignment,
			:success_indicators,
			:as_is_title,
			:as_is_summary,
			:as_is_pros,
			:as_is_cons,
			:as_is_cost_savings,
			:preferred_title,
			:preferred_summary,
			:preferred_acquisition_approach,
			:preferred_pros,
			:preferred_cons,
			:preferred_cost_savings,
			:alternative_a_title,
			:alternative_a_summary,
			:alternative_a_acquisition_approach,
			:alternative_a_pros,
			:alternative_a_cons,
			:alternative_a_cost_savings,
			:alternative_b_title,
			:alternative_b_summary,
			:alternative_b_acquisition_approach,
			:alternative_b_pros,
			:alternative_b_cons,
			:alternative_b_cost_savings,
		    :created_at,
		    :updated_at
		)`
	tx := s.DB.MustBegin()
	//Rollback only happens if transaction isn't committed
	defer tx.Rollback()
	_, err := tx.NamedExec(createBusinessCaseSQL, &businessCase)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to create business case with error %s", err),
			zap.String("EUAUserID", businessCase.EUAUserID),
			zap.String("SystemIntakeID", businessCase.SystemIntakeID.String()),
		)
	}
	for _, cost := range businessCase.LifecycleCostLines {
		cost.BusinessCaseID = id
		_, err = tx.NamedExec(createEstimatedLifecycleCostSQL, &cost)
		if err != nil {
			s.logger.Error(
				fmt.Sprintf(
					"Failed to create cost %s %s %s with error %s",
					cost.Solution,
					cost.Phase,
					cost.Year,
					err,
				),
				zap.String("EUAUserID", businessCase.EUAUserID),
				zap.String("SystemIntakeID", businessCase.SystemIntakeID.String()),
			)
			return &models.BusinessCase{}, err
		}
	}
	err = tx.Commit()
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to create business case %s", err),
			zap.String("EUAUserID", businessCase.EUAUserID),
			zap.String("SystemIntakeID", businessCase.SystemIntakeID.String()),
		)
		return &models.BusinessCase{}, err
	}

	return businessCase, nil
}
