package storage

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// FetchSystemByLCID uses the Lifecycle ID as the unique identifier for a given System
func (s *Store) FetchSystemByLCID(ctx context.Context, lcid string) (*models.System, error) {
	// TODO: this code would emulate the behavior outlined in `ListSystems(...)`
	return nil, fmt.Errorf("not yet implemented")
}

// ListSystems retrieves a collection of Systems, which are a subset of all SystemIntakes that
// have been "decided" and issued an LCID.
func (s *Store) ListSystems(ctx context.Context) ([]*models.System, error) {
	sqlComplete := false
	if sqlComplete {
		// if we can achieve all the filtering necessary via SQL, we can then just rely
		// on "db" field tags in the System type to hydrate via the subset of columns that
		// are needed
		systems := []*models.System{}
		err := s.db.Select(
			&systems,
			`select * from system_intake where status = LCID_ISSUED and NOT EMPTY lcid`,
		)
		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
			return nil, err
		}
		return systems, nil
	}

	if !sqlComplete {
		// if we CANNOT achieve all the filtering necessary via SQL, we can hydrate the objects into
		// SystemIntake types, and then do whatever programmatic filtering might be necessary
		// (e.g. we need to reduce multiple SystemIntake records [proposal vs decommision] into
		// one single record for a given LCID)
		intakes := []*models.SystemIntake{}
		err := s.db.Select(
			&intakes,
			fetchSystemIntakeSQL,
		)
		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch system intakes %s", err))
			return nil, err
		}

		systems := []*models.System{}
		for _, intake := range intakes {
			needToExcludeForSomeReason := false
			if !needToExcludeForSomeReason {
				systems = append(systems, models.SystemFromIntake(intake))
			}
		}

		return systems, nil
	}

	return nil, fmt.Errorf("not yet implemented")
}
