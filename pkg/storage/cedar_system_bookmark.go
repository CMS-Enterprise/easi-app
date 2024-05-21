package storage

import (
	"context"
	"database/sql"
	"errors"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
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
	_, err := s.db.NamedExec(
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
	err := s.db.Select(&results, `SELECT * FROM cedar_system_bookmarks WHERE eua_user_id=$1`, euaUserID)

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

func (s *Store) FetchCedarSystemIsBookmarkedLOADER(ctx context.Context, paramTableJSON string) (map[string]struct{}, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.CedarBookmarkSystemsForm.SelectLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var bookmarks []*models.CedarSystemBookmark
	if err := stmt.Select(&bookmarks, map[string]interface{}{
		"param_table_json": paramTableJSON,
	}); err != nil {
		return nil, err
	}

	store := map[string]struct{}{}

	for _, bookmark := range bookmarks {
		store[bookmark.CedarSystemID] = struct{}{}
	}

	return store, nil
}

func (s *Store) FetchCedarSystemIsBookmarkedLOADER2(ctx context.Context, cedarSystemIDs []string, euaUserID string) ([]*models.CedarSystemBookmark, []error) {
	sqlStatement := "SELECT eua_user_id, cedar_system_id, created_at FROM cedar_system_bookmarks WHERE cedar_system_id = ANY($1::TEXT) AND eua_user_id = $2"

	rows, err := s.db.QueryContext(ctx, sqlStatement, cedarSystemIDs, euaUserID)
	if err != nil {
		return nil, []error{err}
	}
	defer rows.Close()

	var (
		bookmarks []*models.CedarSystemBookmark
		errs      []error
	)

	for rows.Next() {
		var bookmark models.CedarSystemBookmark
		if err := rows.Scan(&bookmark.EUAUserID, &bookmark.CedarSystemID, &bookmark.CreatedAt); err != nil {
			errs = append(errs, err)
			continue
		}

		bookmarks = append(bookmarks, &bookmark)
	}

	return bookmarks, errs
}

// DeleteCedarSystemBookmark deletes an existing cedar system bookmark object in the database
func (s *Store) DeleteCedarSystemBookmark(ctx context.Context, cedarSystemBookmark *models.CedarSystemBookmark) (*models.CedarSystemBookmark, error) {
	euaUserID := appcontext.Principal(ctx).ID()

	const deleteCedarSystemBookmarkSQL = `
		DELETE FROM cedar_system_bookmarks
		WHERE eua_user_id = $1
		AND cedar_system_id = $2;`

	_, err := s.db.Exec(deleteCedarSystemBookmarkSQL, euaUserID, cedarSystemBookmark.CedarSystemID)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete cedar system bookmark with error %s", zap.Error(err))
		return nil, err
	}

	return cedarSystemBookmark, nil
}
