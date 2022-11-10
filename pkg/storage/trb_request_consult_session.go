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

// UpdateTRBRequestConsultSession updates a TRB request consult session record in the database
func (s *Store) UpdateTRBRequestConsultSession(ctx context.Context, session *models.TRBRequestConsultSession) (*models.TRBRequestConsultSession, error) {
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_request_consult_session
		SET
			session_time = :session_time,
			notes = :notes,
			modified_by = :modified_by,
			modified_at = CURRENT_TIMESTAMP
		WHERE trb_request_id = :trb_request_id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request consult session %s", err),
			zap.String("id", session.ID.String()),
		)
		return nil, err
	}
	updated := models.TRBRequestConsultSession{}

	err = stmt.Get(&updated, session)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request consult session %s", err),
			zap.String("id", session.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     session,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, err
}

// GetTRBRequestConsultSessionByTRBRequestID queries the DB for all the TRB request consult session records
// matching the given TRB request ID
func (s *Store) GetTRBRequestConsultSessionByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBRequestConsultSession, error) {
	form := models.TRBRequestConsultSession{}
	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_request_consult_sessions WHERE trb_request_id=:trb_request_id`)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"trb_request_id": trbRequestID}
	err = stmt.Get(&form, arg)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request consult session",
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
