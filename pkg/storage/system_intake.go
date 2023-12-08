package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateSystemIntake creates a system intake, though without saving values for LCID-related fields
func (s *Store) CreateSystemIntake(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
	if intake.ID == uuid.Nil {
		intake.ID = uuid.New()
	}
	createAt := s.clock.Now()
	if intake.CreatedAt == nil {
		intake.CreatedAt = &createAt
	}
	if intake.UpdatedAt == nil {
		intake.UpdatedAt = &createAt
	}
	if intake.Step == "" {
		intake.Step = models.SystemIntakeStepINITIALFORM
	}
	if intake.State == "" {
		intake.State = models.SystemIntakeStateOPEN
	}
	if intake.RequestFormState == "" {
		intake.RequestFormState = models.SIRFSNotStarted
	}
	if intake.DraftBusinessCaseState == "" {
		intake.DraftBusinessCaseState = models.SIRFSNotStarted
	}
	if intake.FinalBusinessCaseState == "" {
		intake.FinalBusinessCaseState = models.SIRFSNotStarted
	}
	if intake.DecisionState == "" {
		intake.DecisionState = models.SIDSNoDecision
	}
	const createIntakeSQL = `
		INSERT INTO system_intakes (
			id,
			eua_user_id,
			status,
			state,
			step,
			request_form_state,
			draft_business_case_state,
			final_business_case_state,
			decision_state,
			request_type,
			requester,
			component,
			business_owner,
			business_owner_component,
			product_manager,
			product_manager_component,
			isso,
			isso_name,
			trb_collaborator,
			trb_collaborator_name,
			oit_security_collaborator,
			oit_security_collaborator_name,
			ea_collaborator,
			ea_collaborator_name,
			project_name,
			project_acronym,
			existing_funding,
			funding_number,
			funding_source,
			business_need,
			solution,
			process_status,
			ea_support_request,
			existing_contract,
			cost_increase,
			cost_increase_amount,
			current_annual_spending,
			planned_year_one_spending,
			contractor,
			contract_vehicle,
			contract_number,
			contract_start_month,
			contract_start_year,
			contract_end_month,
			contract_end_year,
			contract_start_date,
			contract_end_date,
			grt_date,
			grb_date,
			has_ui_changes,
			trb_follow_up_recommendation,
			created_at,
			updated_at
		)
		VALUES (
			:id,
			:eua_user_id,
			:status,
			:state,
			:step,
			:request_form_state,
			:draft_business_case_state,
			:final_business_case_state,
			:decision_state,
			:request_type,
			:requester,
			:component,
			:business_owner,
			:business_owner_component,
			:product_manager,
			:product_manager_component,
			:isso,
			:isso_name,
			:trb_collaborator,
			:trb_collaborator_name,
			:oit_security_collaborator,
			:oit_security_collaborator_name,
			:ea_collaborator,
			:ea_collaborator_name,
			:project_name,
			:project_acronym,
			:existing_funding,
			:funding_number,
			:funding_source,
			:business_need,
			:solution,
			:process_status,
			:ea_support_request,
			:existing_contract,
			:cost_increase,
			:cost_increase_amount,
			:current_annual_spending,
			:planned_year_one_spending,
			:contractor,
			:contract_vehicle,
			:contract_number,
			:contract_start_month,
			:contract_start_year,
			:contract_end_month,
			:contract_end_year,
			:contract_start_date,
			:contract_end_date,
			:grt_date,
			:grb_date,
			:has_ui_changes,
			:trb_follow_up_recommendation,
			:created_at,
			:updated_at
		)`
	_, err := s.db.NamedExec(
		createIntakeSQL,
		intake,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create system intake with error %s", err),
			zap.String("user", intake.EUAUserID.ValueOrZero()),
		)
		return nil, err
	}
	return s.FetchSystemIntakeByID(ctx, intake.ID)
}

// UpdateSystemIntake does an upsert for a system intake
// caller is responsible for setting intake.UpdatedAt if they want to update that field
func (s *Store) UpdateSystemIntake(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
	// We are explicitly not updating ID, EUAUserID and SystemIntakeID

	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
			status = :status,
			step = :step,
			state = :state,
			request_form_state = :request_form_state,
			draft_business_case_state = :draft_business_case_state,
			final_business_case_state = :final_business_case_state,
			decision_state = :decision_state,
			request_type = :request_type,
			requester = :requester,
			component = :component,
			business_owner = :business_owner,
			business_owner_component = :business_owner_component,
			product_manager = :product_manager,
			product_manager_component = :product_manager_component,
			isso = :isso,
			isso_name = :isso_name,
			trb_collaborator = :trb_collaborator,
			trb_collaborator_name = :trb_collaborator_name,
			oit_security_collaborator = :oit_security_collaborator,
			oit_security_collaborator_name = :oit_security_collaborator_name,
			ea_collaborator = :ea_collaborator,
			ea_collaborator_name = :ea_collaborator_name,
			project_name = :project_name,
			project_acronym = :project_acronym,
			existing_funding = :existing_funding,
			funding_number = :funding_number,
			funding_source = :funding_source,
			business_need = :business_need,
			solution = :solution,
			process_status = :process_status,
			ea_support_request = :ea_support_request,
			existing_contract = :existing_contract,
			grt_review_email_body = :grt_review_email_body,
			requester_email_address = :requester_email_address,
			cost_increase = :cost_increase,
			cost_increase_amount = :cost_increase_amount,
			current_annual_spending = :current_annual_spending,
			planned_year_one_spending = :planned_year_one_spending,
			contractor = :contractor,
			contract_vehicle = :contract_vehicle,
			contract_number = :contract_number,
			contract_start_date = :contract_start_date,
			contract_end_date = :contract_end_date,
			updated_at = :updated_at,
			submitted_at = :submitted_at,
			decided_at = :decided_at,
			archived_at = :archived_at,
			grt_date = :grt_date,
			grb_date = :grb_date,
			alfabet_id = :alfabet_id,
			lcid = :lcid,
			lcid_expires_at = :lcid_expires_at,
			lcid_scope = :lcid_scope,
			decision_next_steps = :decision_next_steps,
			lcid_cost_baseline = :lcid_cost_baseline,
			lcid_expiration_alert_ts = :lcid_expiration_alert_ts,
			lcid_retires_at = :lcid_retires_at,
			lcid_issued_at = :lcid_issued_at,
			rejection_reason = :rejection_reason,
			admin_lead = :admin_lead,
			cedar_system_id = :cedar_system_id,
			has_ui_changes = :has_ui_changes,
			trb_follow_up_recommendation = :trb_follow_up_recommendation
		WHERE system_intakes.id = :id
	`
	_, err := s.db.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", intake.ID.String()),
			zap.String("user", intake.EUAUserID.ValueOrZero()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     intake,
			Operation: apperrors.QueryUpdate,
		}
	}
	// the SystemIntake may have been updated to Archived, so we want to use
	// the un-filtered fetch to return the saved object
	return s.FetchSystemIntakeByID(ctx, intake.ID)
}

const fetchSystemIntakeSQL = `
		SELECT
			system_intakes.*,
		    business_cases.id as business_case_id
		FROM
		    system_intakes
		    LEFT JOIN business_cases ON business_cases.system_intake = system_intakes.id
`

// FetchSystemIntakeByID queries the DB for a system intake matching the given ID
func (s *Store) FetchSystemIntakeByID(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
	intake := models.SystemIntake{}
	const whereClause = `
		WHERE system_intakes.id=$1
			AND system_intakes.archived_at IS NULL AND system_intakes.status != 'WITHDRAWN'
`
	err := s.db.Get(&intake, fetchSystemIntakeSQL+whereClause, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			appcontext.ZLogger(ctx).Info(
				"No system intake found",
				zap.Error(err),
				zap.String("id", id.String()),
			)
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.SystemIntake{}}
		}
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch system intake",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	sources := []*models.SystemIntakeFundingSource{}

	// TODO: Rather than two separate queries/round-trips to the database, the funding sources should be
	// queried via a single query that includes a left join on system_intake_funding_sources. This code
	// works and can unblock frontend work that relies on this function, but should be revisited. I was
	// hoping to find a clean way to be able to get the system intake properties out of a query that
	// includes a join on the funding sources table, but the only way I figured out how to do that
	// required explicitly specifying all of the system intake columns, which seemed less than ideal
	// given that any changes made to the models.SystemIntake struct would require also code changes to
	// the code that would handle the joined query result.
	err = s.db.Select(&sources, `
		SELECT *
		FROM system_intake_funding_sources
		WHERE system_intake_id=$1
	`, id)

	if err != nil {
		return nil, err
	}

	intake.FundingSources = sources

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch system intake contacts", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntakeContact{},
			Operation: apperrors.QueryFetch,
		}
	}

	return &intake, nil
}

// FetchSystemIntakeByLifecycleID fetches a system intake by lifecycle ID
// It returns an error if more than one system matches the provided LCID. This is possible
// since there isn't a uniqueness constraint in the database.
func (s *Store) FetchSystemIntakeByLifecycleID(ctx context.Context, lifecycleID string) (*models.SystemIntake, error) {
	intakes := []models.SystemIntake{}
	const matchClause = `
		WHERE system_intakes.lcid=$1
			AND system_intakes.archived_at IS NULL AND system_intakes.status != 'WITHDRAWN'
	`
	err := s.db.Select(&intakes, fetchSystemIntakeSQL+matchClause, lifecycleID)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch system intake %s", err),
			zap.String("lcid", lifecycleID),
		)
		return nil, err
	}

	if len(intakes) > 1 {
		return nil, &apperrors.QueryError{
			Model:     models.SystemIntake{},
			Operation: apperrors.QueryFetch,
			Err:       errors.New("more than one system intake matched lcid"),
		}
	}

	if len(intakes) == 0 {
		return nil, nil
	}

	result := intakes[0]
	return &result, nil
}

// FetchSystemIntakesByEuaID queries the DB for system intakes matching the given EUA ID
func (s *Store) FetchSystemIntakesByEuaID(ctx context.Context, euaID string) (models.SystemIntakes, error) {
	intakes := []models.SystemIntake{}
	const whereClause = `
		WHERE system_intakes.eua_user_id=$1
			AND system_intakes.status != 'WITHDRAWN'
			AND system_intakes.archived_at IS NULL
		ORDER BY created_at DESC
	`
	err := s.db.Select(&intakes, fetchSystemIntakeSQL+whereClause, euaID)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch system intakes %s", err),
			zap.String("euaID", euaID),
		)
		return models.SystemIntakes{}, err
	}
	return intakes, nil
}

// FetchSystemIntakes queries the DB for all system intakes
func (s *Store) FetchSystemIntakes(ctx context.Context) (models.SystemIntakes, error) {
	intakes := []models.SystemIntake{}
	err := s.db.Select(&intakes, fetchSystemIntakeSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
		return models.SystemIntakes{}, err
	}
	return intakes, nil
}

// FetchIntakesForAdmins queries the DB for all system intakes not in the INTAKE_DRAFT, APPROVED, or CLOSED statuses.
// This is useful for the admin home page which intends to show admins all intakes that requesters have submitted.
// This is a bit of a hold-over, and should be simplified when we start to filter based on IT Gov v2 states, which should be
// much simpler to use
// TODO: Modify with https://jiraent.cms.gov/browse/EASI-3440
func (s *Store) FetchIntakesForAdmins(ctx context.Context) ([]*models.SystemIntake, error) {
	intakes := []*models.SystemIntake{}
	err := s.db.Select(&intakes, `
		SELECT * FROM system_intakes WHERE status NOT IN ('INTAKE_DRAFT','APPROVED','CLOSED')
		AND archived_at IS NULL AND status != 'WITHDRAWN'
	`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
		return []*models.SystemIntake{}, err
	}
	return intakes, nil
}

// FetchSystemIntakesByStatuses queries the DB for all system intakes matching a status filter
// Is this in use? It should be removed post admin actions v2 launch or modified
func (s *Store) FetchSystemIntakesByStatuses(ctx context.Context, allowedStatuses []models.SystemIntakeStatus) (models.SystemIntakes, error) {
	var intakes models.SystemIntakes
	query := `
		SELECT
			system_intakes.*,
			business_cases.id as business_case_id
		FROM
			(	SELECT
					distinct ON (system_intakes.id) system_intakes.id, notes.content, notes.created_at
				FROM system_intakes
					LEFT JOIN notes on notes.system_intake = system_intakes.id AND notes.is_archived = false
				WHERE system_intakes.status IN (?)
				ORDER BY system_intakes.id, notes.created_at DESC
			) AS intakes_and_notes
		LEFT JOIN system_intakes ON system_intakes.id = intakes_and_notes.id
		LEFT JOIN business_cases ON business_cases.system_intake = system_intakes.id
	`
	query, args, err := sqlx.In(query, allowedStatuses)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
		return nil, err
	}
	query = s.db.Rebind(query)
	err = s.db.Select(&intakes, query, args...)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
		return nil, err
	}
	return intakes, nil
}

func generateLifecyclePrefix(t time.Time, loc *time.Location) string {
	return t.In(loc).Format("06002")
}

// GenerateLifecycleID returns what the next LCID is expected to be for the current date
//
//	The expected format is a 6-digit number in the form of "YYdddP" where
//		YY - the 2-digit YEAR
//		ddd - the 3-digit ORDINAL DATE, e.g. the number of days elapsed in the given year
//		P - the 1-digit count of how many LCIDs already generated for the given day
//	This routine assumes the LCIDs are being generated in Eastern Time Zone
//	(FYI - the "YYddd" construct is referred to as the "Julian Day" in mainframe
//	programmer circles, though this term seems to be a misappropriation of what
//	astronomers use to mean a count of days since 24 Nov in the year 4714 BC.)
func (s *Store) GenerateLifecycleID(ctx context.Context) (string, error) {
	prefix := generateLifecyclePrefix(s.clock.Now(), s.easternTZ)

	countSQL := `SELECT COUNT(*) FROM system_intakes WHERE lcid ~ $1;`
	var count int
	if err := s.db.Get(&count, countSQL, "^"+prefix); err != nil {
		return "", err
	}
	return fmt.Sprintf("%s%d", prefix, count), nil
}

// FetchSystemIntakeMetrics gets a metrics digest for system intake
func (s *Store) FetchSystemIntakeMetrics(ctx context.Context, startTime time.Time, endTime time.Time) (models.SystemIntakeMetrics, error) {
	type startedQueryResponse struct {
		StartedCount   int `db:"started_count"`
		CompletedCount int `db:"completed_count"`
	}
	const startedCountSQL = `
		WITH "started" AS (
		    SELECT *
		    FROM system_intakes
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
		    FROM system_intakes
		    WHERE submitted_at >=  $1
		      AND submitted_at < $2
		)
		SELECT count(*) AS completed_count,
		       coalesce(sum(CASE WHEN existing_funding IS true THEN 1 ELSE 0 END),0) AS funded_count
		FROM completed
	`

	metrics := models.SystemIntakeMetrics{}

	var startedResponse startedQueryResponse
	err := s.db.Get(
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
	err = s.db.Get(
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

// UpdateAdminLead updates the admin lead for an intake
func (s *Store) UpdateAdminLead(ctx context.Context, id uuid.UUID, adminLead string) (string, error) {
	var intake struct {
		AdminLead string `db:"admin_lead"`
		ID        uuid.UUID
		UpdatedAt time.Time `db:"updated_at"`
	}
	intake.AdminLead = adminLead
	intake.ID = id
	intake.UpdatedAt = time.Now()

	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
			updated_at = :updated_at,
			admin_lead = :admin_lead
		WHERE system_intakes.id = :id
	`
	_, err := s.db.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)
	return adminLead, err
}

// UpdateReviewDates updates the admin lead for an intake
func (s *Store) UpdateReviewDates(ctx context.Context, id uuid.UUID, grbDate *time.Time, grtDate *time.Time) (*models.SystemIntake, error) {
	var intake struct {
		GRBDate   *time.Time `db:"grb_date"`
		GRTDate   *time.Time `db:"grt_date"`
		ID        uuid.UUID
		UpdatedAt time.Time `db:"updated_at"`
	}

	if grbDate != nil {
		intake.GRBDate = grbDate
	}

	if grtDate != nil {
		intake.GRTDate = grtDate
	}

	intake.ID = id
	intake.UpdatedAt = time.Now()

	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
			updated_at = :updated_at,
			grb_date = :grb_date,
			grt_date = :grt_date
		WHERE system_intakes.id = :id
	`
	_, err := s.db.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)

	if err != nil {
		return nil, err
	}

	return s.FetchSystemIntakeByID(ctx, intake.ID)
}

// UpdateSystemIntakeStatus updates the status for an intake
func (s *Store) UpdateSystemIntakeStatus(ctx context.Context, id uuid.UUID, newStatus models.SystemIntakeStatus) (*models.SystemIntake, error) {
	var intake models.SystemIntake
	now := time.Now()
	intake.Status = newStatus
	intake.ID = id
	intake.UpdatedAt = &now
	intake.SetV2FieldsBasedOnV1Status(newStatus) // ensure all V2 fields are calculated and set

	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
			updated_at = :updated_at,
			status = :status,
			step = :step,
			state = :state,
			decision_state = :decision_state,
			request_form_state = :request_form_state,
			draft_business_case_state = :draft_business_case_state,
			final_business_case_state = :final_business_case_state
		WHERE system_intakes.id = :id
	`
	_, err := s.db.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)

	if err != nil {
		return nil, err
	}

	return s.FetchSystemIntakeByID(ctx, intake.ID)
}

// UpdateSystemIntakeLinkedContract updates the contract number that is linked to a system intake
func (s *Store) UpdateSystemIntakeLinkedContract(ctx context.Context, id uuid.UUID, contractNumber null.String) (*models.SystemIntake, error) {
	intake := struct {
		ID             uuid.UUID
		ContractNumber null.String `db:"contract_number"`
		UpdatedAt      time.Time   `db:"updated_at"`
	}{
		ID:             id,
		ContractNumber: contractNumber,
		UpdatedAt:      time.Now(),
	}

	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
			updated_at = :updated_at,
			contract_number = :contract_number
		WHERE system_intakes.id = :id
	`

	_, err := s.db.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)

	if err != nil {
		return nil, err
	}

	return s.FetchSystemIntakeByID(ctx, id)
}

// UpdateSystemIntakeLinkedCedarSystem updates the CEDAR system ID that is linked to a system intake
func (s *Store) UpdateSystemIntakeLinkedCedarSystem(ctx context.Context, id uuid.UUID, cedarSystemID null.String) (*models.SystemIntake, error) {
	intake := struct {
		ID            uuid.UUID
		CedarSystemID null.String `db:"cedar_system_id"`
		UpdatedAt     time.Time   `db:"updated_at"`
	}{
		ID:            id,
		CedarSystemID: cedarSystemID,
		UpdatedAt:     time.Now(),
	}

	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
			updated_at = :updated_at,
			cedar_system_id = :cedar_system_id
		WHERE system_intakes.id = :id
	`

	_, err := s.db.NamedExec(
		updateSystemIntakeSQL,
		intake,
	)

	if err != nil {
		return nil, err
	}

	return s.FetchSystemIntakeByID(ctx, id)
}

// FetchRelatedSystemIntakes retrieves System Intakes that share a CEDAR system ID and/or a contract
// number with a given System Intake
func (s *Store) FetchRelatedSystemIntakes(ctx context.Context, id uuid.UUID) ([]*models.SystemIntake, error) {
	intakes := []*models.SystemIntake{}

	query := `
		SELECT intakes_b.*
		FROM system_intakes as intakes_a
		JOIN system_intakes as intakes_b
		ON
			(intakes_a.cedar_system_id = intakes_b.cedar_system_id
			OR intakes_a.contract_number = intakes_b.contract_number)
		WHERE
			intakes_a.id = $1 AND intakes_b.id != $1;
	`

	err := s.db.Select(&intakes, query, id)
	if err != nil {
		return nil, err
	}
	return intakes, nil
}

// GetSystemIntakesWithLCIDs retrieves all LCIDs that are in use
func (s *Store) GetSystemIntakesWithLCIDs(ctx context.Context) ([]*models.SystemIntake, error) {
	intakes := []*models.SystemIntake{}
	err := s.db.Select(&intakes,
		fetchSystemIntakeSQL+`
		WHERE lcid IS NOT NULL;
	`)
	if err != nil {
		return nil, err
	}
	return intakes, nil
}
