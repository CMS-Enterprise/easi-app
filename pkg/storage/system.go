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
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

var fakeSystems []*models.System

func init() {
	t1 := time.Date(2020, time.January, 1, 8, 0, 0, 0, time.UTC)
	t2 := t1.AddDate(2, 0, -1)
	fakeSystems = []*models.System{
		{
			LCID:        "X990000",
			IntakeID:    uuid.MustParse("00000000-9999-0000-0000-000000000000"),
			CreatedAt:   &t1,
			UpdatedAt:   &t1,
			IssuedAt:    &t1,
			ExpiresAt:   &t2,
			ProjectName: "Three Amigos",
			OwnerID:     null.StringFrom("FAKE0"),
			OwnerName:   "Lucky Dusty Ned",
		},
		{
			LCID:        "X990001",
			IntakeID:    uuid.MustParse("00000000-8888-0000-0000-000000000000"),
			CreatedAt:   &t1,
			UpdatedAt:   &t1,
			IssuedAt:    &t1,
			ExpiresAt:   &t2,
			ProjectName: "Three Musketeers",
			OwnerID:     null.StringFromPtr(nil),
			OwnerName:   "Athos Porthos Aramis",
		},
		{
			LCID:        "X990002",
			IntakeID:    uuid.MustParse("00000000-7777-0000-0000-000000000000"),
			CreatedAt:   &t1,
			UpdatedAt:   &t1,
			IssuedAt:    &t1,
			ExpiresAt:   &t2,
			ProjectName: "Three Stooges",
			OwnerID:     null.StringFrom("FAKE2"),
			OwnerName:   "Moe Larry Curly",
		},
	}
}

// // FetchSystemByLCID uses the Lifecycle ID as the unique identifier for a given System
// func (s *Store) FetchSystemByLCID(ctx context.Context, lcid string) (*models.System, error) {
// 	useFake := true
// 	if useFake {
// 		for _, sys := range fakeSystems {
// 			if lcid == sys.LCID {
// 				return sys, nil
// 			}
// 		}
// 		return nil, fmt.Errorf("system not found: %s", lcid)
// 	}
// 	// TODO: this code would emulate the behavior outlined in `ListSystems(...)`
// 	return nil, fmt.Errorf("not yet implemented")
// }

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
	real, err := s.ldClient.BoolVariation("systems-from-db", flags.Principal(ctx), false)
	if err != nil {
		appcontext.ZLogger(ctx).Error("problem evaluating flag", zap.Error(err))
	}
	return !real
}

const sqlListSystems = `
	SELECT
		id,
		lcid,
		created_at,
		updated_at,
		decided_at,
		lcid_expires_at,
		project_name,
		eua_user_id,
		requester
	FROM system_intake
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
	FROM system_intake
	WHERE
		status='LCID_ISSUED' AND
		request_type='NEW' AND
		lcid IS NOT NULL AND
		id = $1;
`

// FetchSystemByIntakeID queries the DB for a single system
func (s *Store) FetchSystemByIntakeID(ctx context.Context, intakeID uuid.UUID) (*model.System, error) {
	system := model.System{}

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
