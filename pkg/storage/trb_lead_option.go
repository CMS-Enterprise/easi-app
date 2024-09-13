package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CreateTRBLeadOption creates a new TRB lead option record in the database
func (s *Store) CreateTRBLeadOption(ctx context.Context, leadOption *models.TRBLeadOption) (*models.TRBLeadOption, error) {
	leadOption.ID = uuid.New()
	stmt, err := s.DB.PrepareNamed(`
		INSERT INTO trb_lead_options (
			id,
			eua_user_id,
			created_by,
			modified_by
		)
		VALUES (
			:id,
			:eua_user_id,
			:created_by,
			:modified_by
		)
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB lead option with error %s", err),
			zap.String("id", leadOption.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	created := models.TRBLeadOption{}
	err = stmt.Get(&created, leadOption)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB lead option with error %s", zap.Error(err))
		return nil, err
	}
	return &created, nil
}

// DeleteTRBLeadOption deletes an existing TRB lead option record in the database
func (s *Store) DeleteTRBLeadOption(ctx context.Context, euaID string) (*models.TRBLeadOption, error) {
	stmt, err := s.DB.PrepareNamed(`
		DELETE FROM trb_lead_options
		WHERE eua_user_id = :eua_user_id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB lead option %s", err),
			zap.String("id", euaID),
		)
		return nil, err
	}
	defer stmt.Close()

	toDelete := models.TRBLeadOption{}
	toDelete.EUAUserID = euaID
	deleted := models.TRBLeadOption{}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB lead option %s", err),
			zap.String("id", euaID),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}

// GetTRBLeadOptions retrieves all TRB lead option records from the database
func (s *Store) GetTRBLeadOptions(ctx context.Context) ([]*models.TRBLeadOption, error) {
	results := []*models.TRBLeadOption{}

	err := s.DB.Select(&results, `SELECT * FROM trb_lead_options`)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB lead options", zap.Error(err))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBLeadOption{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}
