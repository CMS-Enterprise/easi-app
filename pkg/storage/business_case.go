package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// IntakeExistsMsg is the error we see when there is no valid system intake
const IntakeExistsMsg = "Could not query model *models.BusinessCaseWithCosts with operation Create, received error: pq: insert or update on table \"business_cases\" violates foreign key constraint \"business_case_system_intake_fkey\""

// EuaIDMsg is the error we see when EUA doesn't meet EUA ID constraints
const EuaIDMsg = "Could not query model *models.BusinessCaseWithCosts with operation Create, received error: pq: new row for relation \"business_cases\" violates check constraint \"eua_id_check\""

// ValidStatusMsg is a match for an error we see when there is no valid status
const ValidStatusMsg = "pq: invalid input value for enum business_case_status: "

// UniqueIntakeMsg is a match for an error we see when the system intake already has a biz case
const UniqueIntakeMsg = "pq: duplicate key value violates unique constraint \"unique_intake_per_biz_case\""

// FetchBusinessCaseByID queries the DB for a Business Case matching the given ID
// This is legacy code used in REST endpoints
func (s *Store) FetchBusinessCaseByID(ctx context.Context, businessCaseID uuid.UUID) (*models.BusinessCaseWithCosts, error) {
	businessCase := models.BusinessCaseWithCosts{}
	const fetchBusinessCaseSQL = `
		SELECT
			business_cases.*,
			coalesce(json_agg(estimated_lifecycle_costs) filter (where estimated_lifecycle_costs.* IS NOT NULL), '[]') as lifecycle_cost_lines
		FROM
			business_cases
			LEFT JOIN estimated_lifecycle_costs ON business_cases.id = estimated_lifecycle_costs.business_case
			JOIN system_intakes ON business_cases.system_intake = system_intakes.id
		WHERE
			business_cases.id = $1
		GROUP BY estimated_lifecycle_costs.business_case, business_cases.id, system_intakes.id`

	// Unsafe() is used to avoid errors from the initial_submitted_at and last_submitted_at columns that are in the database, but not in the Go model
	// see https://jiraent.cms.gov/browse/EASI-1693
	err := s.db.Unsafe().Get(&businessCase, fetchBusinessCaseSQL, businessCaseID)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch Business Case %s", err),
			zap.String("id", businessCaseID.String()),
		)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.BusinessCaseWithCosts{}}
		}
		return nil, err
	}
	return &businessCase, nil
}

// GetBusinessCaseBySystemIntakeID queries the DB for a Business Case matching the given ID of the System Intake
func (s *Store) GetBusinessCaseBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.BusinessCase, error) {
	businessCase := models.BusinessCase{}
	err := namedGet(ctx, s.db, &businessCase, sqlqueries.SystemIntakeBusinessCase.GetBusinessCaseByIntakeID, args{
		"system_intake_id": systemIntakeID,
	})
	if err != nil {
		// This function, unlike a few others in this file, does NOT error out if there is no Business Case, since it's
		// totally valid to have a system intake without a Business Case, so we check the error type BEFORE logging
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch Business Case by SystemIntakeID %s", err),
			zap.String("systemIntakeId", systemIntakeID.String()),
		)
		return nil, err
	}
	return &businessCase, nil
}

// GetBusinessCaseBySystemIntakeIDs queries the DB for a Business Case matching the given ID of the System Intake
func (s *Store) GetBusinessCaseBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.BusinessCase, error) {
	businessCases := []*models.BusinessCase{}
	err := namedSelect(ctx, s.db, &businessCases, sqlqueries.SystemIntakeBusinessCase.GetBusinessCaseByIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch Business Case by SystemIntakeIDs %s", err),
		)
		return nil, err
	}
	return businessCases, nil
}

// GetLifecycleCostsByBizCaseID queries the DB for a lifecycle costs by biz case ID
func (s *Store) GetLifecycleCostsByBizCaseID(ctx context.Context, businessCaseID uuid.UUID) ([]*models.EstimatedLifecycleCost, error) {
	estimatedLifecycleCosts := []*models.EstimatedLifecycleCost{}
	err := namedSelect(ctx, s.db, &estimatedLifecycleCosts, sqlqueries.SystemIntakeBusinessCase.GetEstimatedLifecycleCostLinesByBizCaseID, args{
		"business_case_id": businessCaseID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch Business Case lifecycle costs by Business Case ID %s", err),
			zap.String("businessCaseID", businessCaseID.String()),
		)
		return nil, err
	}
	return estimatedLifecycleCosts, nil
}

// GetLifecycleCostsByBizCaseIDs queries the DB for a lifecycle costs by biz case ID
func (s *Store) GetLifecycleCostsByBizCaseIDs(ctx context.Context, businessCaseIDs []uuid.UUID) ([]*models.EstimatedLifecycleCost, error) {
	estimatedLifecycleCosts := []*models.EstimatedLifecycleCost{}
	err := namedSelect(ctx, s.db, &estimatedLifecycleCosts, sqlqueries.SystemIntakeBusinessCase.GetEstimatedLifecycleCostLinesByBizCaseIDs, args{
		"business_case_ids": pq.Array(businessCaseIDs),
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch Business Case lifecycle costs by Business Case ID %s", err),
		)
		return nil, err
	}
	return estimatedLifecycleCosts, nil
}

// FetchOpenBusinessCaseByIntakeID queries the DB for an open Business Case matching the given intake ID
// This is legacy code used in REST endpoints
func (s *Store) FetchOpenBusinessCaseByIntakeID(ctx context.Context, intakeID uuid.UUID) (*models.BusinessCaseWithCosts, error) {
	businessCase := models.BusinessCaseWithCosts{}
	const fetchBusinessCaseSQL = `
		SELECT
			business_cases.*,
			coalesce(json_agg(estimated_lifecycle_costs) filter (where estimated_lifecycle_costs.* is NOT NULL), '[]') as lifecycle_cost_lines
		FROM
			business_cases
			LEFT JOIN estimated_lifecycle_costs ON business_cases.id = estimated_lifecycle_costs.business_case
		WHERE
			business_cases.system_intake = $1 AND business_cases.status = 'OPEN'
		GROUP BY estimated_lifecycle_costs.business_case, business_cases.id`

	// Unsafe() is used to avoid errors from the initial_submitted_at and last_submitted_at columns that are in the database, but not in the Go model
	// see https://jiraent.cms.gov/browse/EASI-1693
	err := s.db.Unsafe().Get(&businessCase, fetchBusinessCaseSQL, intakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch Business Case %s", err),
			zap.String("id", intakeID.String()),
		)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.BusinessCaseWithCosts{}}
		}
		return nil, err
	}
	fmt.Println(businessCase)
	return &businessCase, nil
}

func createEstimatedLifecycleCosts(ctx context.Context, tx *sqlx.Tx, businessCaseID uuid.UUID, estimatedLifecycleCosts []models.EstimatedLifecycleCost) error {
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
	for _, costLine := range estimatedLifecycleCosts {

		// if cost is `nil`, we don't want to attempt to insert that into the DB
		// this is a known behavior -- the frontend will try and send `null` values in the array of costs,
		// so we just catch them here before they make it into the DB
		if costLine.Cost == nil {
			continue
		}

		costLine.ID = uuid.New()
		costLine.BusinessCaseID = businessCaseID
		_, err := tx.NamedExec(createEstimatedLifecycleCostSQL, &costLine)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf(
					"Failed to create cost %s %s with error %s",
					costLine.Solution,
					costLine.Year,
					err,
				),
			)
			return err
		}
	}
	return nil
}

// CreateBusinessCase creates a Business Case
func (s *Store) CreateBusinessCase(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
	return sqlutils.WithTransactionRet(ctx, s.db, func(tx *sqlx.Tx) (*models.BusinessCaseWithCosts, error) {
		id := uuid.New()
		businessCase.ID = id
		const createBusinessCaseSQL = `
		INSERT INTO business_cases (
			id,
			eua_user_id,
			system_intake,
			status,
			project_name,
			project_acronym,
			requester,
			requester_phone_number,
			business_owner,
			business_need,
			collaboration_needed,
			current_solution_summary,
			cms_benefit,
			priority_alignment,
			success_indicators,
			response_to_grt_feedback,
			preferred_title,
			preferred_summary,
			preferred_acquisition_approach,
			preferred_target_contract_award_date,
			preferred_target_completion_date,
			preferred_security_is_approved,
			preferred_security_is_being_reviewed,
			preferred_zero_trust_alignment,
			preferred_hosting_type,
			preferred_hosting_location,
			preferred_hosting_cloud_strategy,
			preferred_hosting_cloud_service_type,
			preferred_has_ui,
			preferred_pros,
			preferred_cons,
			preferred_cost_savings,
			preferred_workforce_training_reqs,
			alternative_a_title,
			alternative_a_summary,
			alternative_a_acquisition_approach,
			alternative_a_target_contract_award_date,
			alternative_a_target_completion_date,
			alternative_a_security_is_approved,
			alternative_a_security_is_being_reviewed,
			alternative_a_zero_trust_alignment,
			alternative_a_hosting_type,
			alternative_a_hosting_location,
			alternative_a_hosting_cloud_strategy,
			alternative_a_hosting_cloud_service_type,
			alternative_a_has_ui,
			alternative_a_pros,
			alternative_a_cons,
			alternative_a_cost_savings,
			alternative_a_workforce_training_reqs,
			alternative_b_title,
			alternative_b_summary,
			alternative_b_acquisition_approach,
			alternative_b_target_contract_award_date,
			alternative_b_target_completion_date,
			alternative_b_security_is_approved,
			alternative_b_security_is_being_reviewed,
			alternative_b_zero_trust_alignment,
			alternative_b_hosting_type,
			alternative_b_hosting_location,
			alternative_b_hosting_cloud_strategy,
			alternative_b_hosting_cloud_service_type,
			alternative_b_has_ui,
			alternative_b_pros,
			alternative_b_cons,
			alternative_b_cost_savings,
			alternative_b_workforce_training_reqs,
		    created_at,
			updated_at
		)
		VALUES (
			:id,
			:eua_user_id,
			:system_intake,
			:status,
			:project_name,
			:project_acronym,
			:requester,
			:requester_phone_number,
			:business_owner,
			:business_need,
			:collaboration_needed,
			:current_solution_summary,
			:cms_benefit,
			:priority_alignment,
			:success_indicators,
			:response_to_grt_feedback,
			:preferred_title,
			:preferred_summary,
			:preferred_acquisition_approach,
			:preferred_target_contract_award_date,
			:preferred_target_completion_date,
			:preferred_security_is_approved,
			:preferred_security_is_being_reviewed,
			:preferred_zero_trust_alignment,
			:preferred_hosting_type,
			:preferred_hosting_location,
			:preferred_hosting_cloud_strategy,
			:preferred_hosting_cloud_service_type,
			:preferred_has_ui,
			:preferred_pros,
			:preferred_cons,
			:preferred_cost_savings,
			:preferred_workforce_training_reqs,
			:alternative_a_title,
			:alternative_a_summary,
			:alternative_a_acquisition_approach,
			:alternative_a_target_contract_award_date,
			:alternative_a_target_completion_date,
			:alternative_a_security_is_approved,
			:alternative_a_security_is_being_reviewed,
			:alternative_a_zero_trust_alignment,
			:alternative_a_hosting_type,
			:alternative_a_hosting_location,
			:alternative_a_hosting_cloud_strategy,
			:alternative_a_hosting_cloud_service_type,
			:alternative_a_has_ui,
			:alternative_a_pros,
			:alternative_a_cons,
			:alternative_a_cost_savings,
			:alternative_a_workforce_training_reqs,
			:alternative_b_title,
			:alternative_b_summary,
			:alternative_b_acquisition_approach,
			:alternative_b_target_contract_award_date,
			:alternative_b_target_completion_date,
			:alternative_b_security_is_approved,
			:alternative_b_security_is_being_reviewed,
			:alternative_b_zero_trust_alignment,
			:alternative_b_hosting_type,
			:alternative_b_hosting_location,
			:alternative_b_hosting_cloud_strategy,
			:alternative_b_hosting_cloud_service_type,
			:alternative_b_has_ui,
			:alternative_b_pros,
			:alternative_b_cons,
			:alternative_b_cost_savings,
			:alternative_b_workforce_training_reqs,
		    :created_at,
		    :updated_at
		)`
		logger := appcontext.ZLogger(ctx)

		_, err := tx.NamedExec(createBusinessCaseSQL, &businessCase)
		if err != nil {
			logger.Error(
				fmt.Sprintf("Failed to create Business Case with error %s", err),
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
		err = createEstimatedLifecycleCosts(ctx, tx, businessCase.ID, businessCase.LifecycleCostLines)
		if err != nil {
			logger.Error(
				fmt.Sprintf("Failed to create Business Case with lifecycle costs with error %s", err),
				zap.String("EUAUserID", businessCase.EUAUserID),
				zap.String("BusinessCaseID", businessCase.ID.String()),
			)
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryPost,
			}
		}

		return businessCase, nil
	})
}

// UpdateBusinessCase creates a Business Case
func (s *Store) UpdateBusinessCase(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
	return sqlutils.WithTransactionRet(ctx, s.db, func(tx *sqlx.Tx) (*models.BusinessCaseWithCosts, error) {
		// We are explicitly not updating ID, EUAUserID and SystemIntakeID
		const updateBusinessCaseSQL = `
		UPDATE business_cases
		SET
			project_name = :project_name,
			project_acronym = :project_acronym,
			requester = :requester,
			requester_phone_number = :requester_phone_number,
			business_owner = :business_owner,
			business_need = :business_need,
			collaboration_needed = :collaboration_needed,
			current_solution_summary = :current_solution_summary,
			cms_benefit = :cms_benefit,
			priority_alignment = :priority_alignment,
			success_indicators = :success_indicators,
			response_to_grt_feedback = :response_to_grt_feedback,
			preferred_title = :preferred_title,
			preferred_summary = :preferred_summary,
			preferred_acquisition_approach = :preferred_acquisition_approach,
			preferred_target_contract_award_date = :preferred_target_contract_award_date,
			preferred_target_completion_date = :preferred_target_completion_date,
			preferred_security_is_approved = :preferred_security_is_approved,
			preferred_security_is_being_reviewed = :preferred_security_is_being_reviewed,
			preferred_zero_trust_alignment = :preferred_zero_trust_alignment,
			preferred_hosting_type = :preferred_hosting_type,
			preferred_hosting_location = :preferred_hosting_location,
			preferred_hosting_cloud_strategy = :preferred_hosting_cloud_strategy,
			preferred_hosting_cloud_service_type = :preferred_hosting_cloud_service_type,
			preferred_has_ui = :preferred_has_ui,
			preferred_pros = :preferred_pros,
			preferred_cons = :preferred_cons,
			preferred_cost_savings = :preferred_cost_savings,
			preferred_workforce_training_reqs = :preferred_workforce_training_reqs,
			alternative_a_title = :alternative_a_title,
			alternative_a_summary = :alternative_a_summary,
			alternative_a_acquisition_approach = :alternative_a_acquisition_approach,
			alternative_a_target_contract_award_date = :alternative_a_target_contract_award_date,
			alternative_a_target_completion_date = :alternative_a_target_completion_date,
			alternative_a_security_is_approved = :alternative_a_security_is_approved,
			alternative_a_security_is_being_reviewed = :alternative_a_security_is_being_reviewed,
			alternative_a_zero_trust_alignment = :alternative_a_zero_trust_alignment,
			alternative_a_hosting_type = :alternative_a_hosting_type,
			alternative_a_hosting_location = :alternative_a_hosting_location,
			alternative_a_hosting_cloud_strategy = :alternative_a_hosting_cloud_strategy,
			alternative_a_hosting_cloud_service_type = :alternative_a_hosting_cloud_service_type,
			alternative_a_has_ui = :alternative_a_has_ui,
			alternative_a_pros = :alternative_a_pros,
			alternative_a_cons = :alternative_a_cons,
			alternative_a_cost_savings = :alternative_a_cost_savings,
			alternative_a_workforce_training_reqs = :alternative_a_workforce_training_reqs,
			alternative_b_title = :alternative_b_title,
			alternative_b_summary = :alternative_b_summary,
			alternative_b_acquisition_approach = :alternative_b_acquisition_approach,
			alternative_b_target_contract_award_date = :alternative_b_target_contract_award_date,
			alternative_b_target_completion_date = :alternative_b_target_completion_date,
			alternative_b_security_is_approved = :alternative_b_security_is_approved,
			alternative_b_security_is_being_reviewed = :alternative_b_security_is_being_reviewed,
			alternative_b_zero_trust_alignment = :alternative_b_zero_trust_alignment,
			alternative_b_hosting_type = :alternative_b_hosting_type,
			alternative_b_hosting_location = :alternative_b_hosting_location,
			alternative_b_hosting_cloud_strategy = :alternative_b_hosting_cloud_strategy,
			alternative_b_hosting_cloud_service_type = :alternative_b_hosting_cloud_service_type,
			alternative_b_has_ui = :alternative_b_has_ui,
			alternative_b_pros = :alternative_b_pros,
			alternative_b_cons = :alternative_b_cons,
			alternative_b_cost_savings = :alternative_b_cost_savings,
			alternative_b_workforce_training_reqs = :alternative_b_workforce_training_reqs,
			updated_at = :updated_at,
		  archived_at = :archived_at,
		  status = :status
		WHERE business_cases.id = :id
	`
		const deleteLifecycleCostsSQL = `
		DELETE FROM estimated_lifecycle_costs
		WHERE business_case = :id
	`

		logger := appcontext.ZLogger(ctx)
		result, err := tx.NamedExec(updateBusinessCaseSQL, &businessCase)
		if err != nil {
			logger.Error(
				fmt.Sprintf("Failed to update Business Case %s", err),
				zap.String("id", businessCase.ID.String()),
			)
			return businessCase, err
		}
		affectedRows, rowsAffectedErr := result.RowsAffected()
		if affectedRows == 0 || rowsAffectedErr != nil {
			logger.Error(
				fmt.Sprintf("Failed to update Business Case %s", err),
				zap.String("id", businessCase.ID.String()),
			)
			return businessCase, errors.New("business case not found")
		}

		_, err = tx.NamedExec(deleteLifecycleCostsSQL, &businessCase)
		if err != nil {
			logger.Error(
				fmt.Sprintf("Failed to update pre-existing Business Case costs %s", err),
				zap.String("id", businessCase.ID.String()),
			)
			return businessCase, err
		}

		err = createEstimatedLifecycleCosts(ctx, tx, businessCase.ID, businessCase.LifecycleCostLines)
		if err != nil {
			return businessCase, err
		}

		return businessCase, nil
	})
}
