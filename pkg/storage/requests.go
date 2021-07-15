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
	ID              uuid.UUID
	Name            null.String
	SubmittedAt     *time.Time        `db:"submitted_at"`
	Type            model.RequestType `db:"record_type"`
	Status          string
	StatusCreatedAt *time.Time  `db:"status_created_at"`
	LifecycleID     null.String `db:"lcid"`
	NextMeetingDate *time.Time  `db:"next_meeting_date"`
}

// FetchMyRequests queries the DB for an accessibility requests.
// TODO implement cursor pagination
func (s *Store) FetchMyRequests(ctx context.Context) ([]Request, error) {
	principal := appcontext.Principal(ctx)
	EUAUserID := principal.ID()

	requests := []Request{}

	requestsSQL := `
	SELECT DISTINCT ON (requests.id) * FROM (
		SELECT 
			aras.id,
			aras.name,
			aras.created_at AS submitted_at,
			'ACCESSIBILITY_REQUEST' record_type,
			aras.status::text,
			aras.status_created_at,
			null lcid,
			test_dates.date AS next_meeting_date
		FROM accessibility_requests_and_statuses aras
		LEFT JOIN test_dates ON aras.id = test_dates.request_id AND test_dates.date > NOW()
		WHERE aras.deleted_at IS NULL
		AND aras.eua_user_id = $1
		ORDER BY test_dates.date ASC
	) requests
	UNION
	SELECT
		id,
		project_name AS name,
		submitted_at,
		'GOVERNANCE_REQUEST' record_type,
		status::text,
		null status_created_at,
		lcid,
        LEAST(
			CASE WHEN grb_date > NOW() THEN grb_date ELSE null END,
			CASE WHEN grt_date > NOW() THEN grt_date ELSE null END
		) AS next_meeting_date
	FROM system_intakes
		WHERE archived_at IS NULL
		AND system_intakes.eua_user_id = $1
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
