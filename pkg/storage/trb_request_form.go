package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateTRBRequestForm creates a new TRB request form record in the database
func (s *Store) CreateTRBRequestForm(ctx context.Context, form *models.TRBRequestForm) (*models.TRBRequestForm, error) {
	form.ID = uuid.New()
	fmt.Println("\n\n~~~~~~~~~~~~~~~\n\n")
	fmt.Println(form)
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_request_forms (
			id,
			trb_request_id,
			component,
			needs_assistance_with,
			has_solution_in_mind,
			where_in_process,
			has_expected_start_end_dates,
			collab_groups
		)
		VALUES (
			:id,
			:trb_request_id,
			:component,
			:needs_assistance_with,
			:has_solution_in_mind,
			:where_in_process,
			:has_expected_start_end_dates,
			:collab_groups
		)
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB create form %s", err),
			zap.String("id", form.ID.String()),
		)
		return nil, err
	}

	created := models.TRBRequestForm{}
	err = stmt.Get(&created, form)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request form with error %s", zap.Error(err))
		return nil, err
	}
	return &created, nil
}

// UpdateTRBRequestForm updates a TRB request form record in the database
func (s *Store) UpdateTRBRequestForm(ctx context.Context, form *models.TRBRequestForm) (*models.TRBRequestForm, error) {
	// return form, nil
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_request_forms
		SET
			component = :component,
			needs_assistance_with = :needs_assistance_with,
			has_solution_in_mind = :has_solution_in_mind,
			where_in_process = :where_in_process,
			has_expected_start_end_dates = :has_expected_start_end_dates,
			collab_groups = :collab_groups
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
	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_request_forms WHERE trb_request_id=$1`)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"id": trbRequestID}
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
