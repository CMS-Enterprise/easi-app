package storage

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IntakeExistsMsg is the error we see when there is no valid system intake
const IntakeExistsMsg = "pq: insert or update on table \"business_case\" violates foreign key constraint \"business_case_system_intake_fkey\""

// EuaIDMsg is the error we see when EUA doesn't meet EUA ID constraints
const EuaIDMsg = "pq: new row for relation \"business_case\" violates check constraint \"eua_id_check\""

// ValidStatusMsg is a match for an error we see when there is no valid status
const ValidStatusMsg = "pq: invalid input value for enum business_case_status: "

// UniqueIntakeMsg is a match for an error we see when the system intake already has a biz case
const UniqueIntakeMsg = "pq: duplicate key value violates unique constraint \"unique_intake_per_biz_case\""

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
			business_case.id = $1 AND business_case.status != 'ARCHIVED'
		GROUP BY estimated_lifecycle_cost.business_case, business_case.id`

	err := s.DB.Get(&businessCase, fetchBusinessCaseSQL, id)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to fetch business case %s", err),
			zap.String("id", id.String()),
		)
		if err.Error() == "sql: no rows in result set" {
			return &models.BusinessCase{}, &apperrors.ResourceNotFoundError{Err: err, Resource: models.BusinessCase{}}
		}
		return &models.BusinessCase{}, err
	}
	return &businessCase, nil
}

// FetchBusinessCaseIDByIntakeID queries the DB for a business case matching the given intake ID
func (s *Store) FetchBusinessCaseIDByIntakeID(intakeID uuid.UUID) (*uuid.UUID, error) {
	var businessCaseID *uuid.UUID = nil
	const fetchBusinessCaseIDSQL = `
		SELECT
			id
		FROM
			business_case
		WHERE
			business_case.system_intake = $1 AND business_case.status != 'ARCHIVED'`

	err := s.DB.Get(&businessCaseID, fetchBusinessCaseIDSQL, intakeID)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return businessCaseID, nil
		}

		s.logger.Error(
			fmt.Sprintf("Failed to fetch business case id for intake %s", err),
			zap.String("System Intake", intakeID.String()),
		)
		return businessCaseID, err
	}
	return businessCaseID, nil
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
			business_case.eua_user_id = $1 AND business_case.status != 'ARCHIVED'
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

func createEstimatedLifecycleCosts(tx *sqlx.Tx, businessCase *models.BusinessCase, logger *zap.Logger) error {
	for _, cost := range businessCase.LifecycleCostLines {
		cost.ID = uuid.New()
		cost.BusinessCaseID = businessCase.ID
		_, err := tx.NamedExec(createEstimatedLifecycleCostSQL, &cost)
		if err != nil {
			logger.Error(
				fmt.Sprintf(
					"Failed to create cost %s %s with error %s",
					cost.Solution,
					cost.Year,
					err,
				),
				zap.String("EUAUserID", businessCase.EUAUserID),
				zap.String("SystemIntakeID", businessCase.SystemIntakeID.String()),
			)
			return err
		}
	}
	return nil
}

// CreateBusinessCase creates a business case
func (s *Store) CreateBusinessCase(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	id := uuid.New()
	businessCase.ID = id
	const createBusinessCaseSQL = `
		INSERT INTO business_case (
			id,
			eua_user_id,
			system_intake,
			status,
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
			preferred_hosting_type,
			preferred_hosting_location,
			preferred_hosting_cloud_service_type,
			preferred_has_ui,
			preferred_pros,
			preferred_cons,
			preferred_cost_savings,
			alternative_a_title,
			alternative_a_summary,
			alternative_a_acquisition_approach,
			alternative_a_hosting_type,
			alternative_a_hosting_location,
			alternative_a_hosting_cloud_service_type,
			alternative_a_has_ui,
			alternative_a_pros,
			alternative_a_cons,
			alternative_a_cost_savings,
			alternative_b_title,
			alternative_b_summary,
			alternative_b_acquisition_approach,
			alternative_b_hosting_type,
			alternative_b_hosting_location,
			alternative_b_hosting_cloud_service_type,
			alternative_b_has_ui,
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
			:status,
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
			:preferred_hosting_type,
			:preferred_hosting_location,
			:preferred_hosting_cloud_service_type,
			:preferred_has_ui,
			:preferred_pros,
			:preferred_cons,
			:preferred_cost_savings,
			:alternative_a_title,
			:alternative_a_summary,
			:alternative_a_acquisition_approach,
			:alternative_a_hosting_type,
			:alternative_a_hosting_location,
			:alternative_a_hosting_cloud_service_type,
			:alternative_a_has_ui,
			:alternative_a_pros,
			:alternative_a_cons,
			:alternative_a_cost_savings,
			:alternative_b_title,
			:alternative_b_summary,
			:alternative_b_acquisition_approach,
			:alternative_b_hosting_type,
			:alternative_b_hosting_location,
			:alternative_b_hosting_cloud_service_type,
			:alternative_b_has_ui,
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
		if err.Error() == "pq: duplicate key value violates unique constraint \"unique_intake_per_biz_case\"" {
			return &models.BusinessCase{},
				&apperrors.ResourceConflictError{
					Err:        err,
					Resource:   models.BusinessCase{},
					ResourceID: businessCase.SystemIntakeID.String(),
				}
		}
		return &models.BusinessCase{}, err
	}
	err = createEstimatedLifecycleCosts(tx, businessCase, s.logger)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to create business case with lifecycle costs with error %s", err),
			zap.String("EUAUserID", businessCase.EUAUserID),
			zap.String("BusinessCaseID", businessCase.ID.String()),
		)
		return &models.BusinessCase{}, err
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

// UpdateBusinessCase creates a business case
func (s *Store) UpdateBusinessCase(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	// We are explicitly not updating ID, EUAUserID and SystemIntakeID
	const updateBusinessCaseSQL = `
		UPDATE business_case
		SET
			project_name = :project_name,
			requester = :requester,
			requester_phone_number = :requester_phone_number,
			business_owner = :business_owner,
			business_need = :business_need,
			cms_benefit = :cms_benefit,
			priority_alignment = :priority_alignment,
			success_indicators = :success_indicators,
			as_is_title = :as_is_title,
			as_is_summary = :as_is_summary,
			as_is_pros = :as_is_pros,
			as_is_cons = :as_is_cons,
			as_is_cost_savings = :as_is_cost_savings,
			preferred_title = :preferred_title,
			preferred_summary = :preferred_summary,
			preferred_acquisition_approach = :preferred_acquisition_approach,
			preferred_hosting_type = :preferred_hosting_type,
			preferred_hosting_location = :preferred_hosting_location,
			preferred_hosting_cloud_service_type = :preferred_hosting_cloud_service_type,
			preferred_has_ui = :preferred_has_ui,
			preferred_pros = :preferred_pros,
			preferred_cons = :preferred_cons,
			preferred_cost_savings = :preferred_cost_savings,
			alternative_a_title = :alternative_a_title,
			alternative_a_summary = :alternative_a_summary,
			alternative_a_acquisition_approach = :alternative_a_acquisition_approach,
			alternative_a_hosting_type = :alternative_a_hosting_type,
			alternative_a_hosting_location = :alternative_a_hosting_location,
			alternative_a_hosting_cloud_service_type = :alternative_a_hosting_cloud_service_type,
			alternative_a_has_ui = :alternative_a_has_ui,
			alternative_a_pros = :alternative_a_pros,
			alternative_a_cons = :alternative_a_cons,
			alternative_a_cost_savings = :alternative_a_cost_savings,
			alternative_b_title = :alternative_b_title,
			alternative_b_summary = :alternative_b_summary,
			alternative_b_acquisition_approach = :alternative_b_acquisition_approach,
			alternative_b_hosting_type = :alternative_b_hosting_type,
			alternative_b_hosting_location = :alternative_b_hosting_location,
			alternative_b_hosting_cloud_service_type = :alternative_b_hosting_cloud_service_type,
			alternative_b_has_ui = :alternative_b_has_ui,
			alternative_b_pros = :alternative_b_pros,
			alternative_b_cons = :alternative_b_cons,
			alternative_b_cost_savings = :alternative_b_cost_savings,
			updated_at = :updated_at,
		    submitted_at = :submitted_at,
		    archived_at = :archived_at,
		    status = :status
		WHERE business_case.id = :id
	`
	const deleteLifecycleCostsSQL = `
		DELETE FROM estimated_lifecycle_cost
		WHERE business_case = :id
	`

	tx := s.DB.MustBegin()
	//Rollback only happens if transaction isn't committed
	defer tx.Rollback()
	result, err := tx.NamedExec(updateBusinessCaseSQL, &businessCase)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to update business case %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, err
	}
	affectedRows, rowsAffectedErr := result.RowsAffected()
	if affectedRows == 0 || rowsAffectedErr != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to update business case %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, errors.New("business case not found")
	}

	_, err = tx.NamedExec(deleteLifecycleCostsSQL, &businessCase)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to update pre-existing business case costs %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, err
	}

	err = createEstimatedLifecycleCosts(tx, businessCase, s.logger)
	if err != nil {
		return businessCase, err
	}

	err = tx.Commit()
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to update business case %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, err
	}

	// createEstimatedLifecycleCostSQL
	return businessCase, nil
}
