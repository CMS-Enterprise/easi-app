package storage

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
)

// Request defines the generic request object pulled from multiple db tables
type Request struct {
	ID          uuid.UUID
	Name        string
	SubmittedAt *time.Time `db:"submitted_at"`
	CreatedAt   time.Time  `db:"created_at"`
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
			created_at
		FROM accessibility_requests
			WHERE deleted_at IS NULL
			AND eua_user_id = $1
		UNION
		SELECT
			id,
			project_name AS name,
			submitted_at,
			created_at
		FROM system_intakes
			WHERE eua_user_id = $1
		ORDER BY created_at desc
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
