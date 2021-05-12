package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/models"
)

var fakeSystems []*models.System

func init() {
	fakeSystems = []*models.System{
		{
			LCID:                   "X990000",
			ID:                     uuid.MustParse("00000000-9999-0000-0000-000000000000"),
			Name:                   "Three Amigos",
			BusinessOwnerName:      null.StringFrom("Lucky Dusty Ned"),
			BusinessOwnerComponent: null.StringFrom("Horsies"),
		},
		{
			LCID:                   "X990001",
			ID:                     uuid.MustParse("00000000-8888-0000-0000-000000000000"),
			Name:                   "Three Musketeers",
			BusinessOwnerName:      null.StringFrom("Athos Porthos Aramis"),
			BusinessOwnerComponent: null.StringFrom("Swordses"),
		},
		{
			LCID:                   "X990002",
			ID:                     uuid.MustParse("00000000-7777-0000-0000-000000000000"),
			Name:                   "Three Stooges",
			BusinessOwnerName:      null.StringFrom("Moe Larry Curly"),
			BusinessOwnerComponent: null.StringFrom("Nyuknyuks"),
		},
	}
}

// ListSystems retrieves a collection of Systems, which are a subset of all SystemIntakes that
// have been "decided" and issued an LCID.
func (s *Store) ListSystems(ctx context.Context) ([]*models.System, error) {
	if s.useFakeSystems(ctx) {
		return fakeSystems, nil
	}
	return s.listSystems(ctx)
}

func (s *Store) useFakeSystems(ctx context.Context) bool {
	// generally, it's best to have feature flags named in such a way that their
	// lifecycle goes from:
	// _negation_ - indicating pre-existing functionality
	// (which in this case means defaulting to fake data),
	// to:
	// _affirmation_ - indicating the new functionality to be rolled out
	// (which in this case mean opting in to fetching the systems from the system_intake table)
	real, err := s.ldClient.BoolVariation("systems-from-db", flags.Principal(ctx), true)
	if err != nil {
		appcontext.ZLogger(ctx).Error("problem evaluating flag", zap.Error(err))
	}
	return !real
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
