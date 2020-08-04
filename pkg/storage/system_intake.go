package storage

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateSystemIntake creates a system intake
func (s *Store) CreateSystemIntake(intake *models.SystemIntake) (*models.SystemIntake, error) {
	id := uuid.New()
	intake.ID = id
	createAt := s.clock.Now()
	intake.CreatedAt = &createAt
	intake.UpdatedAt = &createAt
	const createIntakeSQL = `	
		INSERT INTO system_intake (
			id,
			eua_user_id,
		    status,
			requester,
			component,
			business_owner,
			business_owner_component,
			product_manager,
			product_manager_component,
			isso,
			trb_collaborator,
			oit_security_collaborator,
			ea_collaborator,
			project_name,
			existing_funding,
			funding_source,
			business_need,
			solution,
			process_status,
			ea_support_request,
			existing_contract,
			created_at,
			updated_at
		) 
		VALUES (
			:id,
			:eua_user_id,
		    :status,
			:requester,
			:component,
			:business_owner,
			:business_owner_component,
			:product_manager,
			:product_manager_component,
			:isso,
			:trb_collaborator,
			:oit_security_collaborator,
			:ea_collaborator,
			:project_name,
			:existing_funding,
			:funding_source,
			:business_need,
			:solution,
			:process_status,
			:ea_support_request,
			:existing_contract,
		    :created_at,
		    :updated_at
		)`
	_, err := s.DB.NamedExec(
		createIntakeSQL,
		intake,
	)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to create system intake with error %s", err),
			zap.String("user", intake.EUAUserID),
		)
		return &models.SystemIntake{}, err
	}
	return intake, nil
}

// UpdateSystemIntake does an upsert for a system intake
func (s *Store) UpdateSystemIntake(intake *models.SystemIntake) (*models.SystemIntake, error) {
	// We are explicitly not updating ID, EUAUserID and SystemIntakeID
	const updateSystemIntakeSQL = `
		UPDATE system_intake 
		SET
		    status = :status,
			requester = :requester,
			component = :component,
			business_owner = :business_owner,
			business_owner_component = :business_owner_component,
			product_manager = :product_manager,
			product_manager_component = :product_manager_component,
			isso = :isso,
			trb_collaborator = :trb_collaborator,
			oit_security_collaborator = :oit_security_collaborator,
			ea_collaborator = :ea_collaborator,
			project_name = :project_name,
			existing_funding = :existing_funding,
			funding_source = :funding_source,
			business_need = :business_need,
			solution = :solution,
			process_status = :process_status,
			ea_support_request = :ea_support_request,
			existing_contract = :existing_contract,
		    grt_review_email_body = :grt_review_email_body,
		    requester_email_address = :requester_email_address,
			updated_at = :updated_at,
			submitted_at = :submitted_at,
		    decided_at = :decided_at,
			alfabet_id = :alfabet_id
		WHERE system_intake.id = :id
	`
	_, err := s.DB.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", intake.ID.String()),
			zap.String("user", intake.EUAUserID),
		)
	}
	return intake, err
}

// FetchSystemIntakeByID queries the DB for a system intake matching the given ID
func (s *Store) FetchSystemIntakeByID(id uuid.UUID) (*models.SystemIntake, error) {
	intake := models.SystemIntake{}

	err := s.DB.Get(&intake, "SELECT * FROM public.system_intake WHERE id=$1", id)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to fetch system intake %s", err),
			zap.String("id", id.String()),
		)
		if err.Error() == "sql: no rows in result set" {
			return &models.SystemIntake{}, &apperrors.ResourceNotFoundError{Err: err, Resource: models.SystemIntake{}}
		}
		return &models.SystemIntake{}, err
	}
	// This should cover all statuses that might have a related business case on it.
	// In the future submitted will also need to be checked.
	if intake.Status != models.SystemIntakeStatusDRAFT {
		bizCaseID, fetchErr := s.FetchBusinessCaseIDByIntakeID(intake.ID)
		if fetchErr != nil {
			return &intake, nil
		}
		intake.BusinessCaseID = bizCaseID
	}
	return &intake, nil
}

// FetchSystemIntakesByEuaID queries the DB for system intakes matching the given EUA ID
func (s *Store) FetchSystemIntakesByEuaID(euaID string) (models.SystemIntakes, error) {
	intakes := []models.SystemIntake{}
	err := s.DB.Select(&intakes, "SELECT * FROM system_intake WHERE eua_user_id=$1", euaID)
	if err != nil {
		s.logger.Error(
			fmt.Sprintf("Failed to fetch system intakes %s", err),
			zap.String("euaID", euaID),
		)
		return models.SystemIntakes{}, err
	}
	for k, intake := range intakes {
		if intake.Status != models.SystemIntakeStatusDRAFT {
			bizCaseID, fetchErr := s.FetchBusinessCaseIDByIntakeID(intake.ID)
			if fetchErr != nil {
				return models.SystemIntakes{}, fetchErr
			}
			intakes[k].BusinessCaseID = bizCaseID
		}
	}
	return intakes, nil
}

// FetchSystemIntakeMetrics gets a metrics digest for system intake
func (s *Store) FetchSystemIntakeMetrics(startTime time.Time, endTime time.Time) (models.SystemIntakeMetrics, error) {
	type startedQueryResponse struct {
		StartedCount   int `db:"started_count"`
		CompletedCount int `db:"completed_count"`
	}
	const startedCountSQL = `
		WITH "started" AS (
		    SELECT * 
		    FROM system_intake 
		    WHERE created_at >=  $1
		      AND created_at < $2
		)
		SELECT count(*) AS started_count,
		       coalesce(
		           sum(
		               CASE WHEN submitted_at >=  $1
		                             AND submitted_at < $2
		                   THEN 1 ELSE 0 END
		               ),
		           0) AS completed_count
		FROM started;
	`
	type fundedQueryResponse struct {
		CompletedCount int `db:"completed_count"`
		FundedCount    int `db:"funded_count"`
	}
	const fundedCountSQL = `
		WITH "completed" AS (
		    SELECT existing_funding
		    FROM system_intake 
		    WHERE submitted_at >=  $1 
		      AND submitted_at < $2    
		) 
		SELECT count(*) AS completed_count, 
		       coalesce(sum(CASE WHEN existing_funding IS true THEN 1 ELSE 0 END),0) AS funded_count
		FROM completed
	`

	metrics := models.SystemIntakeMetrics{}

	var startedResponse startedQueryResponse
	err := s.DB.Get(
		&startedResponse,
		startedCountSQL,
		&startTime,
		&endTime,
	)
	if err != nil {
		return metrics, err
	}
	metrics.Started = startedResponse.StartedCount
	metrics.CompletedOfStarted = startedResponse.CompletedCount

	var fundedResponse fundedQueryResponse
	err = s.DB.Get(
		&fundedResponse,
		fundedCountSQL,
		&startTime,
		&endTime,
	)
	if err != nil {
		return metrics, err
	}
	metrics.Completed = fundedResponse.CompletedCount
	metrics.Funded = fundedResponse.FundedCount

	return metrics, nil
}
