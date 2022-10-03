package storage

import (
	"context"
	"database/sql"
	"errors"
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
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_request_forms (
			id,
			eua_user_id,
			trb_request_id,
			role,
			component,
			created_by,
			modified_by
		)
		VALUES (
			:id,
			:eua_user_id,
			:trb_request_id,
			:role,
			:component,
			:created_by,
			:modified_by
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
		SET role = :role,
			component = :component,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE id = :id
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

// GetTRBRequestFormsByTRBRequestID queries the DB for all the TRB request form records
// matching the given TRB request ID
func (s *Store) GetTRBRequestFormsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestForm, error) {
	results := []*models.TRBRequestForm{}

	err := s.db.Select(&results, `SELECT * FROM trb_request_forms WHERE trb_request_id=$1`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB request forms", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestForm{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteTRBRequestForm deletes an existing TRB request form record in the database
func (s *Store) DeleteTRBRequestForm(ctx context.Context, id uuid.UUID) (*models.TRBRequestForm, error) {
	stmt, err := s.db.PrepareNamed(`
		DELETE FROM trb_request_forms
		WHERE id = :id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request form %s", err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	toDelete := models.TRBRequestForm{}
	toDelete.ID = id
	deleted := models.TRBRequestForm{}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request form %s", err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}
