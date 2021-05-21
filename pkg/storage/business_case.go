package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IntakeExistsMsg is the error we see when there is no valid system intake
const IntakeExistsMsg = "Could not query model *models.BusinessCase with operation Create, received error: pq: insert or update on table \"business_cases\" violates foreign key constraint \"business_case_system_intake_fkey\""

// EuaIDMsg is the error we see when EUA doesn't meet EUA ID constraints
const EuaIDMsg = "Could not query model *models.BusinessCase with operation Create, received error: pq: new row for relation \"business_cases\" violates check constraint \"eua_id_check\""

// ValidStatusMsg is a match for an error we see when there is no valid status
const ValidStatusMsg = "pq: invalid input value for enum business_case_status: "

// UniqueIntakeMsg is a match for an error we see when the system intake already has a biz case
const UniqueIntakeMsg = "pq: duplicate key value violates unique constraint \"unique_intake_per_biz_case\""

// FetchBusinessCaseByID queries the DB for a business case matching the given ID
func (s *Store) FetchBusinessCaseByID(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error) {
	businessCase := models.BusinessCase{}
	const fetchBusinessCaseSQL = `
		SELECT
			business_cases.*,
			json_agg(estimated_lifecycle_costs) as lifecycle_cost_lines,
			system_intakes.status as system_intake_status
		FROM
			business_cases
			LEFT JOIN estimated_lifecycle_costs ON business_cases.id = estimated_lifecycle_costs.business_case
			JOIN system_intakes ON business_cases.system_intake = system_intakes.id
		WHERE
			business_cases.id = $1
		GROUP BY estimated_lifecycle_costs.business_case, business_cases.id, system_intakes.id`

	err := s.db.Get(&businessCase, fetchBusinessCaseSQL, id)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch business case %s", err),
			zap.String("id", id.String()),
		)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.BusinessCase{}}
		}
		return nil, err
	}
	return &businessCase, nil
}

// FetchOpenBusinessCaseByIntakeID queries the DB for an open business case matching the given intake ID
func (s *Store) FetchOpenBusinessCaseByIntakeID(ctx context.Context, intakeID uuid.UUID) (*models.BusinessCase, error) {
	businessCase := models.BusinessCase{}
	const fetchBusinessCaseSQL = `
		SELECT
			business_cases.*,
			json_agg(estimated_lifecycle_costs) as lifecycle_cost_lines
		FROM
			business_cases
			LEFT JOIN estimated_lifecycle_costs ON business_cases.id = estimated_lifecycle_costs.business_case
		WHERE
			business_cases.system_intake = $1 AND business_cases.status = 'OPEN'
		GROUP BY estimated_lifecycle_costs.business_case, business_cases.id`
	err := s.db.Get(&businessCase, fetchBusinessCaseSQL, intakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch business case %s", err),
			zap.String("id", intakeID.String()),
		)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.BusinessCase{}}
		}
		return nil, err
	}
	return &businessCase, nil
}

func createEstimatedLifecycleCosts(ctx context.Context, tx *sqlx.Tx, businessCase *models.BusinessCase) error {
	const createEstimatedLifecycleCostSQL = `
		INSERT INTO estimated_lifecycle_costs (
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
	for i := range businessCase.LifecycleCostLines {
		cost := businessCase.LifecycleCostLines[i]
		cost.ID = uuid.New()
		cost.BusinessCaseID = businessCase.ID
		_, err := tx.NamedExec(createEstimatedLifecycleCostSQL, &cost)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
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
func (s *Store) CreateBusinessCase(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	id := uuid.New()
	businessCase.ID = id
	const createBusinessCaseSQL = `
		INSERT INTO business_cases (
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
			preferred_security_is_approved,
			preferred_security_is_being_reviewed,
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
			alternative_a_security_is_approved,
			alternative_a_security_is_being_reviewed,
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
			alternative_b_security_is_approved,
			alternative_b_security_is_being_reviewed,
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
			:preferred_security_is_approved,
			:preferred_security_is_being_reviewed,
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
			:alternative_a_security_is_approved,
			:alternative_a_security_is_being_reviewed,
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
			:alternative_b_security_is_approved,
			:alternative_b_security_is_being_reviewed,
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
	logger := appcontext.ZLogger(ctx)
	tx := s.db.MustBegin()
	//Rollback only happens if transaction isn't committed
	defer tx.Rollback()
	_, err := tx.NamedExec(createBusinessCaseSQL, &businessCase)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create business case with error %s", err),
			zap.String("EUAUserID", businessCase.EUAUserID),
			zap.String("SystemIntakeID", businessCase.SystemIntakeID.String()),
		)
		if err.Error() == "pq: duplicate key value violates unique constraint \"unique_intake_per_biz_case\"" {
			return nil,
				&apperrors.ResourceConflictError{
					Err:        err,
					Resource:   models.BusinessCase{},
					ResourceID: businessCase.SystemIntakeID.String(),
				}
		}
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     businessCase,
			Operation: apperrors.QueryPost,
		}
	}
	err = createEstimatedLifecycleCosts(ctx, tx, businessCase)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create business case with lifecycle costs with error %s", err),
			zap.String("EUAUserID", businessCase.EUAUserID),
			zap.String("BusinessCaseID", businessCase.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     businessCase,
			Operation: apperrors.QueryPost,
		}
	}
	err = tx.Commit()
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create business case %s", err),
			zap.String("EUAUserID", businessCase.EUAUserID),
			zap.String("SystemIntakeID", businessCase.SystemIntakeID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     businessCase,
			Operation: apperrors.QueryPost,
		}
	}

	return businessCase, nil
}

// UpdateBusinessCase creates a business case
func (s *Store) UpdateBusinessCase(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
	// We are explicitly not updating ID, EUAUserID and SystemIntakeID
	const updateBusinessCaseSQL = `
		UPDATE business_cases
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
			preferred_security_is_approved = :preferred_security_is_approved,
			preferred_security_is_being_reviewed = :preferred_security_is_being_reviewed,
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
			alternative_a_security_is_approved = :alternative_a_security_is_approved,
			alternative_a_security_is_being_reviewed = :alternative_a_security_is_being_reviewed,
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
			alternative_b_security_is_approved = :alternative_b_security_is_approved,
			alternative_b_security_is_being_reviewed = :alternative_b_security_is_being_reviewed,
			alternative_b_hosting_type = :alternative_b_hosting_type,
			alternative_b_hosting_location = :alternative_b_hosting_location,
			alternative_b_hosting_cloud_service_type = :alternative_b_hosting_cloud_service_type,
			alternative_b_has_ui = :alternative_b_has_ui,
			alternative_b_pros = :alternative_b_pros,
			alternative_b_cons = :alternative_b_cons,
			alternative_b_cost_savings = :alternative_b_cost_savings,
			updated_at = :updated_at,
		  archived_at = :archived_at,
		  status = :status,
			initial_submitted_at = :initial_submitted_at,
		  last_submitted_at = :last_submitted_at
		WHERE business_cases.id = :id
	`
	const deleteLifecycleCostsSQL = `
		DELETE FROM estimated_lifecycle_costs
		WHERE business_case = :id
	`

	logger := appcontext.ZLogger(ctx)
	tx := s.db.MustBegin()
	//Rollback only happens if transaction isn't committed
	defer tx.Rollback()
	result, err := tx.NamedExec(updateBusinessCaseSQL, &businessCase)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update business case %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, err
	}
	affectedRows, rowsAffectedErr := result.RowsAffected()
	if affectedRows == 0 || rowsAffectedErr != nil {
		logger.Error(
			fmt.Sprintf("Failed to update business case %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, errors.New("business case not found")
	}

	_, err = tx.NamedExec(deleteLifecycleCostsSQL, &businessCase)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update pre-existing business case costs %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, err
	}

	err = createEstimatedLifecycleCosts(ctx, tx, businessCase)
	if err != nil {
		return businessCase, err
	}

	err = tx.Commit()
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update business case %s", err),
			zap.String("id", businessCase.ID.String()),
		)
		return businessCase, err
	}

	// createEstimatedLifecycleCostSQL
	return businessCase, nil
}
