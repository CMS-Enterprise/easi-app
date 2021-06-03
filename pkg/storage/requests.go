package storage

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

// Request defines the generic request object pulled from multiple db tables
type Request struct {
	ID          uuid.UUID
	Name        null.String
	SubmittedAt *time.Time        `db:"submitted_at"`
	Type        model.RequestType `db:"record_type"`
}

// FetchMyRequests queries the DB for an accessibility requests.
// TODO implement cursor pagination
func (s *Store) FetchMyRequests(ctx context.Context) ([]Request, error) {
	principal := appcontext.Principal(ctx)
	EUAUserID := principal.ID()

	requests := []Request{}

	requestsSQL := `
		SELECT 
			id,
			name,
			created_at AS submitted_at,
			'ACCESSIBILITY_REQUEST' record_type
		FROM accessibility_requests
			WHERE deleted_at IS NULL
			AND eua_user_id = $1
		UNION
		SELECT
			id,
			project_name AS name,
			submitted_at,
			'GOVERNANCE_REQUEST' record_type
		FROM system_intakes
			WHERE archived_at IS NULL
			AND eua_user_id = $1
		ORDER BY submitted_at desc nulls first
	`

	err := s.db.Select(&requests, requestsSQL, EUAUserID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return requests, nil
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility requests", zap.Error(err))
		return nil, &apperrors.QueryError{
			Err:       err,
			Operation: apperrors.QueryFetch,
		}
	}

	return requests, nil
}
