package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// CreateCedarSystemBookmark creates a new cedar system bookmark object in the database
func (s *Store) CreateCedarSystemBookmark(ctx context.Context, cedarSystemBookmark *models.CedarSystemBookmark) (*models.CedarSystemBookmark, error) {
	if len(cedarSystemBookmark.EUAUserID) < 1 {
		cedarSystemBookmark.EUAUserID = appcontext.Principal(ctx).ID()
	}

	cedarSystemBookmark.CreatedAt = helpers.PointerTo(s.clock.Now().UTC())
	const createCedarSystemBookmarkSQL = `
		INSERT INTO cedar_system_bookmarks (
			eua_user_id,
			cedar_system_id,
			created_at
		)
		VALUES (
			:eua_user_id,
			:cedar_system_id,
			:created_at
		) ON CONFLICT ON CONSTRAINT cedar_system_bookmarks_pkey DO UPDATE SET created_at = :created_at`
	_, err := s.DB.NamedExec(
		createCedarSystemBookmarkSQL,
		cedarSystemBookmark,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create cedar system bookmark with error %s", zap.Error(err))
		return nil, err
	}
	return cedarSystemBookmark, nil
}

// FetchCedarSystemBookmarks queries the DB for all the cedar system bookmarks matching the given user's EUA ID
func (s *Store) FetchCedarSystemBookmarks(ctx context.Context) ([]*models.CedarSystemBookmark, error) {
	results := []*models.CedarSystemBookmark{}

	euaUserID := appcontext.Principal(ctx).ID()
	err := s.DB.Select(&results, `SELECT * FROM cedar_system_bookmarks WHERE eua_user_id=$1`, euaUserID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch cedar system bookmarks", zap.Error(err), zap.String("id", euaUserID))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.CedarSystemBookmark{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteCedarSystemBookmark deletes an existing cedar system bookmark object in the database
func (s *Store) DeleteCedarSystemBookmark(ctx context.Context, cedarSystemBookmark *models.CedarSystemBookmark) (*models.CedarSystemBookmark, error) {
	euaUserID := appcontext.Principal(ctx).ID()

	const deleteCedarSystemBookmarkSQL = `
		DELETE FROM cedar_system_bookmarks
		WHERE eua_user_id = $1
		AND cedar_system_id = $2;`

	_, err := s.DB.Exec(deleteCedarSystemBookmarkSQL, euaUserID, cedarSystemBookmark.CedarSystemID)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete cedar system bookmark with error %s", zap.Error(err))
		return nil, err
	}

	return cedarSystemBookmark, nil
}

// FetchCedarSystemIsBookmarkedByCedarSystemIDs returns a slice of `bool` for each incoming BookmarkRequest. This method differs from
// other Store methods used by dataloaders as it IS responsible for ordering the output. Once this function exits, we lose
// all context of what came back from the DB, so we order in here before returning to the caller
func (s *Store) FetchCedarSystemIsBookmarkedByCedarSystemIDs(ctx context.Context, bookmarkRequests []models.BookmarkRequest) ([]bool, error) {
	// build lists for multiple `where` clauses
	var (
		euaUserIDs = make([]string, len(bookmarkRequests))
		systemIDs  = make([]string, len(bookmarkRequests))
	)

	for i, req := range bookmarkRequests {
		euaUserIDs[i] = req.EuaUserID
		systemIDs[i] = req.CedarSystemID
	}

	var results []models.BookmarkRequest
	if err := namedSelect(ctx, s.DB, &results, sqlqueries.CedarBookmarkSystemsForm.SelectByCedarSystemIDs, args{
		"eua_user_ids":     pq.Array(euaUserIDs),
		"cedar_system_ids": pq.Array(systemIDs),
	}); err != nil {
		return nil, err
	}

	store := map[models.BookmarkRequest]struct{}{}

	for _, result := range results {
		store[result] = helpers.EmptyStruct
	}

	// order results map by the input keys (`bookmarkRequests`)
	var out []bool
	for _, req := range bookmarkRequests {
		_, ok := store[req]
		out = append(out, ok)
	}

	return out, nil
}
