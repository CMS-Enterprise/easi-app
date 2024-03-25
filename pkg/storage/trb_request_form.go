package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
	"github.com/cmsgov/easi-app/pkg/sqlutils"

	_ "embed"
)

// CreateTRBRequestForm creates a new TRBRequestForm record
// Note this will be refactored to not use the store, but is left now for organization
func (s *Store) CreateTRBRequestForm(ctx context.Context, np sqlutils.NamedPreparer, form *models.TRBRequestForm) (*models.TRBRequestForm, error) {
	if form.ID == uuid.Nil {
		form.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.TRBRequestForm.Create)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB create form %s", err),
			zap.String("id", form.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	created := models.TRBRequestForm{}
	err = stmt.Get(&created, form)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request form with error %s", zap.Error(err))
		return nil, err
	}
	return &created, err

}

// UpdateTRBRequestForm updates a TRB request form record in the database
func (s *Store) UpdateTRBRequestForm(ctx context.Context, form *models.TRBRequestForm) (*models.TRBRequestForm, error) {
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_request_forms
		SET
			status = :status,
			component = :component,
			needs_assistance_with = :needs_assistance_with,
			has_solution_in_mind = :has_solution_in_mind,
			proposed_solution = :proposed_solution,
			where_in_process = :where_in_process,
			where_in_process_other = :where_in_process_other,
			has_expected_start_end_dates = :has_expected_start_end_dates,
			expected_start_date = :expected_start_date,
			expected_end_date = :expected_end_date,
			collab_groups = :collab_groups,
			collab_date_security = :collab_date_security,
			collab_date_enterprise_architecture = :collab_date_enterprise_architecture,
			collab_date_cloud = :collab_date_cloud,
			collab_date_privacy_advisor = :collab_date_privacy_advisor,
			collab_date_governance_review_board = :collab_date_governance_review_board,
			collab_date_other = :collab_date_other,
			collab_group_other = :collab_group_other,
			collab_grb_consult_requested = :collab_grb_consult_requested,
			subject_area_options = :subject_area_options,
			subject_area_option_other = :subject_area_option_other,
			submitted_at = :submitted_at,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE trb_request_id = :trb_request_id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request form %s", err),
			zap.String("id", form.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBRequestForm{}

	err = stmt.Get(&updated, form)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request form %s", err),
			zap.String("id", form.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     form,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, err
}

// GetTRBRequestFormByTRBRequestID queries the DB for all the TRB request form records
// matching the given TRB request ID
func (s *Store) GetTRBRequestFormByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestForm, error) {
	form := models.TRBRequestForm{}
	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_request_forms WHERE trb_request_id=:trb_request_id`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request form",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"trb_request_id": trbRequestID}
	err = stmt.Get(&form, arg)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request form",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     form,
			Operation: apperrors.QueryFetch,
		}
	}
	return &form, err
}

// GetFundingSourcesByRequestID queries the DB for all the TRB request form funding sources
// matching the given TRB request ID
func (s *Store) GetFundingSourcesByRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBFundingSource, error) {
	fundingSources := []*models.TRBFundingSource{}
	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_request_funding_sources WHERE trb_request_id=:trb_request_id`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request funding sources",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"trb_request_id": trbRequestID}
	err = stmt.Select(&fundingSources, arg)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request funding sources",
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     fundingSources,
			Operation: apperrors.QueryFetch,
		}
	}
	return fundingSources, err
}

// DeleteTRBRequestForm deletes an existing TRB request form record in the database
func (s *Store) DeleteTRBRequestForm(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestForm, error) {
	stmt, err := s.db.PrepareNamed(`
		DELETE FROM trb_request_forms
		WHERE trb_request_id = :trb_request_id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request form %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	toDelete := models.TRBRequestForm{}
	toDelete.ID = trbRequestID
	deleted := models.TRBRequestForm{}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request form %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}
