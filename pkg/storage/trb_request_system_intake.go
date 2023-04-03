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

// CreateTRBRequestSystemIntake creates a new TRB request SystemIntake record in the database
func (s *Store) CreateTRBRequestSystemIntake(ctx context.Context, trbIntake *models.TRBRequestSystemIntake) (*models.TRBRequestSystemIntake, error) {
	trbIntake.ID = uuid.New()
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_request_system_intakes (
			id,
			trb_request_id,
			system_intake_id,
			created_by,
			modified_by
		)
		VALUES (
			:id,
			:trb_request_id,
			:system_intake_id,
			:created_by,
			:modified_by
		)
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to relate system intake to TRB request %s", err),
			zap.String("id", trbIntake.ID.String()),
		)
		return nil, err
	}

	created := models.TRBRequestSystemIntake{}
	err = stmt.Get(&created, trbIntake)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to relate system intake to TRB request with error %s", zap.Error(err))
		return nil, err
	}
	return &created, nil
}

// GetTRBRequestSystemIntakesByTRBRequestID retrieves all system intakes that have been related to a given TRB
// request ID
func (s *Store) GetTRBRequestSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	results := []*models.SystemIntake{}

	err := s.db.Select(&results, `
		SELECT b.*
		FROM trb_request_system_intakes a
		JOIN system_intakes b
		ON b.id = a.system_intake_id
		WHERE a.trb_request_id = $1;`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request system intakes",
			zap.Error(err),
			zap.String("id", trbRequestID.String()))

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestSystemIntake{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteTRBRequestSystemIntake deletes an existing TRB request attendee record in the database
func (s *Store) DeleteTRBRequestSystemIntake(ctx context.Context, trbRequestID uuid.UUID, systemIntakeID uuid.UUID) (*models.TRBRequestSystemIntake, error) {
	toDelete := models.TRBRequestSystemIntake{
		TRBRequestID:   trbRequestID,
		SystemIntakeID: systemIntakeID,
	}
	deleted := models.TRBRequestSystemIntake{}

	stmt, err := s.db.PrepareNamed(`
		DELETE FROM trb_request_system_intakes
		WHERE trb_request_id = :trb_request_id
		AND system_intake_id = :system_intake_id
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request system intake relationship %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
			zap.String("systemIntakeID", systemIntakeID.String()),
		)
		return nil, err
	}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request system intake relationship %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
			zap.String("systemIntakeID", systemIntakeID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}

// DeleteTRBRequestSystemIntake deletes an existing TRB request attendee record in the database
func (s *Store) DeleteTRBRequestSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestSystemIntake, error) {
	deleted := []*models.TRBRequestSystemIntake{}

	stmt, err := s.db.PrepareNamed(`
		DELETE FROM trb_request_system_intakes
		WHERE trb_request_id = :trb_request_id
		RETURNING *;`)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request system intake relationships %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}

	err = stmt.Select(&deleted, map[string]interface{}{
		"trb_request_id": trbRequestID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB request system intake relationships %s", err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     deleted,
			Operation: apperrors.QueryUpdate,
		}
	}

	return deleted, err
}
