package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// ListSystems retrieves a collection of Systems, which are a subset of all SystemIntakes that
// have been "decided" and issued an LCID.
func (s *Store) ListSystems(ctx context.Context) ([]*models.System, error) {
	return s.listSystems(ctx)
}

const sqlListSystems = `
	SELECT
		id,
		lcid,
		project_name AS name,
		business_owner AS business_owner_name,
		business_owner_component
	FROM system_intakes
	WHERE
		status='LCID_ISSUED' AND
		request_type='NEW' AND
		lcid IS NOT NULL;
`

func (s *Store) listSystems(ctx context.Context) ([]*models.System, error) {
	results := []*models.System{}
	err := s.db.Select(&results, sqlListSystems)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return results, nil
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch systems", zap.Error(err))
		return nil, err
	}

	return results, nil
}

const sqlFetchSystemByIntakeID = `
	SELECT
		id,
		project_name AS name,
		business_owner AS business_owner_name,
		business_owner_component,
		lcid
	FROM system_intakes
	WHERE
		status='LCID_ISSUED' AND
		request_type='NEW' AND
		lcid IS NOT NULL AND
		id = $1;
`

// FetchSystemByIntakeID queries the DB for a single system
func (s *Store) FetchSystemByIntakeID(ctx context.Context, intakeID uuid.UUID) (*models.System, error) {
	system := models.System{}

	err := s.db.Get(&system, sqlFetchSystemByIntakeID, intakeID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.System{}}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch system", zap.Error(err), zap.String("intakeID", intakeID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     system,
			Operation: apperrors.QueryFetch,
		}
	}

	return &system, nil
}
