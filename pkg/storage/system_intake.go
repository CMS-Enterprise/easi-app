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

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
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
		intake.State = models.SystemIntakeStateOpen
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
			current_annual_spending_it_portion,
			planned_year_one_spending,
			planned_year_one_spending_it_portion,
			contractor,
			contract_vehicle,
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
			contract_name,
			created_at,
			updated_at
		)
		VALUES (
			:id,
			:eua_user_id,
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
			:current_annual_spending_it_portion,
			:planned_year_one_spending,
			:planned_year_one_spending_it_portion,
			:contractor,
			:contract_vehicle,
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
			:contract_name,
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

// UpdateSystemIntake serves as a wrapper for UpdateSystemIntakeNP, which is the actual implementation
// for updating System Intakes.
//
// This method only exists to provide a transactional wrapper around the actual implementation, as a vast majority of the codebase
// was written before the introduction of transactions in the storage layer. This method should eventually be removed in favor of
// using UpdateSystemIntakeNP directly (and that function renamed).
func (s *Store) UpdateSystemIntake(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
	return sqlutils.WithTransactionRet[*models.SystemIntake](ctx, s, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		return s.UpdateSystemIntakeNP(ctx, tx, intake)
	})
}

// UpdateSystemIntakeNP does an upsert for a system intake
// The caller is responsible for setting intake.UpdatedAt if they want to update that field
//
// The "NP" suffix stands for "NamedPreparer", as this function was written to avoid the need to update all
// of the existing code that uses UpdateSystemIntake to use a transactional wrapper.
func (s *Store) UpdateSystemIntakeNP(ctx context.Context, np sqlutils.NamedPreparer, intake *models.SystemIntake) (*models.SystemIntake, error) {
	// We are explicitly not updating ID, EUAUserID and SystemIntakeID
	const updateSystemIntakeSQL = `
		UPDATE system_intakes
		SET
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
			current_annual_spending_it_portion = :current_annual_spending_it_portion,
			planned_year_one_spending = :planned_year_one_spending,
			planned_year_one_spending_it_portion = :planned_year_one_spending_it_portion,
			contractor = :contractor,
			contract_vehicle = :contract_vehicle,
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
			trb_follow_up_recommendation = :trb_follow_up_recommendation,
			contract_name = :contract_name,
			system_relation_type = :system_relation_type
		WHERE system_intakes.id = :id
	`
	updateStmt, err := np.PrepareNamed(updateSystemIntakeSQL)
	if err != nil {
		return nil, err
	}
	defer updateStmt.Close()

	_, err = updateStmt.Exec(intake)
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
	//
	// Using the "NP" version of the fetch method to allow the update and fetch to be part of a transaction
	return s.FetchSystemIntakeByIDNP(ctx, np, intake.ID)
}

const fetchSystemIntakeSQL = `
		SELECT
			system_intakes.*,
		    business_cases.id as business_case_id
		FROM
		    system_intakes
		    LEFT JOIN business_cases ON business_cases.system_intake = system_intakes.id
`

// FetchSystemIntakeByID serves as a wrapper for FetchSystemIntakeByIDNP, which is the actual implementation
// for fetching System Intakes by ID.
//
// This method only exists to provide a transactional wrapper around the actual implementation, as a vast majority of the codebase
// was written before the introduction of transactions in the storage layer. This method should eventually be removed in favor of
// using FetchSystemIntakeByIDNP directly (and that function renamed).
func (s *Store) FetchSystemIntakeByID(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
	return sqlutils.WithTransactionRet[*models.SystemIntake](ctx, s, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		return s.FetchSystemIntakeByIDNP(ctx, tx, id)
	})
}

// FetchSystemIntakeByIDNP queries the DB for a system intake matching the given ID
//
// The "NP" suffix stands for "NamedPreparer", as this function was written to avoid the need to update all
// of the existing code that uses FetchSystemIntakeByID to use a transactional wrapper.
func (s *Store) FetchSystemIntakeByIDNP(ctx context.Context, np sqlutils.NamedPreparer, id uuid.UUID) (*models.SystemIntake, error) {
	// we do not filter for archived because the update method relies on this method to return the archived intake
	const whereClause = `
		WHERE system_intakes.id = :id
	`
	intakeStmt, err := np.PrepareNamed(fetchSystemIntakeSQL + whereClause)
	if err != nil {
		return nil, err
	}
	defer intakeStmt.Close()

	intake := models.SystemIntake{}
	err = intakeStmt.Get(&intake, map[string]interface{}{
		"id": id.String(),
	})

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

	// TODO: Rather than two separate queries/round-trips to the database, the funding sources should be
	// queried via a single query that includes a left join on system_intake_funding_sources. This code
	// works and can unblock frontend work that relies on this function, but should be revisited. I was
	// hoping to find a clean way to be able to get the system intake properties out of a query that
	// includes a join on the funding sources table, but the only way I figured out how to do that
	// required explicitly specifying all of the system intake columns, which seemed less than ideal
	// given that any changes made to the models.SystemIntake struct would require also code changes to
	// the code that would handle the joined query result.
	fundingSourcesSQL := `
		SELECT *
		FROM system_intake_funding_sources
		WHERE system_intake_id= :id;
	`
	fundingSourcesStmt, err := np.PrepareNamed(fundingSourcesSQL)
	if err != nil {
		return nil, err
	}
	defer fundingSourcesStmt.Close()

	sources := []*models.SystemIntakeFundingSource{}
	err = fundingSourcesStmt.Select(&sources, map[string]interface{}{
		"id": id.String(),
	})

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch system intake funding sources", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntakeFundingSource{},
			Operation: apperrors.QueryFetch,
		}
	}

	intake.FundingSources = sources

	return &intake, nil
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

// FetchSystemIntakesWithReviewRequested queries the DB for all open system intakes where user is requested
func (s *Store) FetchSystemIntakesWithReviewRequested(ctx context.Context, userID uuid.UUID) ([]*models.SystemIntake, error) {
	intakes := []*models.SystemIntake{}
	err := namedSelect(ctx, s, &intakes, sqlqueries.SystemIntakeGRBReviewer.GetIntakesWhereReviewRequested, args{
		"user_id": userID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
		return []*models.SystemIntake{}, err
	}
	return intakes, nil
}

// FetchSystemIntakesByStateForAdmins queries the DB for all system intakes with a matching state
// The intent of this query is to return all intakes that are in a state that is relevant to admins (i.e. not in a draft state, not archived)
func (s *Store) FetchSystemIntakesByStateForAdmins(ctx context.Context, state models.SystemIntakeState) ([]*models.SystemIntake, error) {
	var intakes []*models.SystemIntake
	err := s.db.Select(&intakes, `
		SELECT *
		FROM system_intakes
		WHERE state=$1
		AND archived_at IS NULL
		AND submitted_at IS NOT NULL
	`, state)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch system intakes by state", zap.Error(err))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntake{},
			Operation: apperrors.QueryFetch,
		}
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

func (s *Store) GetMySystemIntakes(ctx context.Context) ([]*models.SystemIntake, error) {
	var intakes []*models.SystemIntake

	err := namedSelect(ctx, s, &intakes, sqlqueries.SystemIntake.GetByUser, args{
		"eua_user_id": appcontext.Principal(ctx).Account().Username,
	})

	return intakes, err
}
