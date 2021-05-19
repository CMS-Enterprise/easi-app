package storage

import (
	"context"
	"database/sql"
	"errors"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// FetchMyRequests queries the DB for an accessibility requests.
// TODO implement cursor pagination
func (s *Store) FetchMyRequests(ctx context.Context) ([]models.AccessibilityRequest, error) {
	principal := appcontext.Principal(ctx)
	EUAUserID := principal.ID()

	requests := []models.AccessibilityRequest{}

	requestsSQL := `SELECT * FROM accessibility_requests
		WHERE deleted_at IS NULL
		AND eua_user_id = $1
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
