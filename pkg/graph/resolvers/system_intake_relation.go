package resolvers

import (
	"context"

	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// SetSystemIntakeRelationExistingService sets the relationship between a system intake and
// an existing service by setting a free-text contract/service name, clearing relationships between
// intakes and CEDAR systems, and setting any contract number relationships
func SetSystemIntakeRelationExistingService(
	ctx context.Context,
	store *storage.Store,
	input *model.SetSystemIntakeRelationExistingServiceInput,
) (*models.SystemIntake, error) {
	return sqlutils.WithTransaction[models.SystemIntake](store, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}

		// Set contract name
		intake.ContractName = null.StringFrom(input.ContractName)
		updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
		if err != nil {
			return nil, err
		}

		// TODO: STORE -> Remove CEDAR system relationships
		// TODO: STORE -> Delete & recreate contract number relationships

		return updatedIntake, nil
	})
}
