package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
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
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}

		// Set contract name
		intake.ContractName = zero.StringFrom(input.ContractName)
		relationType := models.RelationTypeExistingService
		intake.SystemRelationType = &relationType
		updatedIntake, err := store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}

		// Remove CEDAR system relationships
		if err := store.SetSystemIntakeSystems(ctx, tx, input.SystemIntakeID, []string{}); err != nil {
			return nil, err
		}
		// Delete & recreate contract number relationships
		if err := store.SetSystemIntakeContractNumbers(ctx, tx, input.SystemIntakeID, input.ContractNumbers); err != nil {
			return nil, err
		}

		return updatedIntake, nil
	})
}

// SetSystemIntakeRelationNewSystem effectively clears the relationship between a system intake
// and any previously set list of CEDAR Systems and contract/service names. It also
// sets any contract number relationships.
func SetSystemIntakeRelationNewSystem(
	ctx context.Context,
	store *storage.Store,
	input *model.SetSystemIntakeRelationNewSystemInput,
) (*models.SystemIntake, error) {
	return sqlutils.WithTransaction[models.SystemIntake](store, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}

		// Clear contract name
		intake.ContractName = zero.StringFromPtr(nil)
		relationType := models.RelationTypeNewSystem
		intake.SystemRelationType = &relationType
		updatedIntake, err := store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}

		// Remove CEDAR system relationships
		if err := store.SetSystemIntakeSystems(ctx, tx, input.SystemIntakeID, []string{}); err != nil {
			return nil, err
		}
		// Delete & recreate contract number relationships
		if err := store.SetSystemIntakeContractNumbers(ctx, tx, input.SystemIntakeID, input.ContractNumbers); err != nil {
			return nil, err
		}

		return updatedIntake, nil
	})
}

// SetSystemIntakeRelationExistingSystem sets the relationship between a system intake and
// a list of CEDAR Systems by setting an array of CEDAR System IDs, clearing any data about
// contract/service names, and setting any contract number relationships.
func SetSystemIntakeRelationExistingSystem(
	ctx context.Context,
	store *storage.Store,
	getCedarSystem func(ctx context.Context, systemID string) (*models.CedarSystem, error),
	input *model.SetSystemIntakeRelationExistingSystemInput,
) (*models.SystemIntake, error) {
	return sqlutils.WithTransaction[models.SystemIntake](store, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}

		// Clear contract name
		intake.ContractName = zero.StringFromPtr(nil)
		relationType := models.RelationTypeExistingSystem
		intake.SystemRelationType = &relationType
		updatedIntake, err := store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}

		// ensure all given CEDAR system IDs are valid by checking with CEDAR
		for _, systemID := range input.CedarSystemIDs {
			if _, err = getCedarSystem(ctx, systemID); err != nil {
				return nil, err
			}
		}

		// Add CEDAR system relationships
		if err := store.SetSystemIntakeSystems(ctx, tx, input.SystemIntakeID, input.CedarSystemIDs); err != nil {
			return nil, err
		}
		// Delete & recreate contract number relationships
		if err := store.SetSystemIntakeContractNumbers(ctx, tx, input.SystemIntakeID, input.ContractNumbers); err != nil {
			return nil, err
		}

		return updatedIntake, nil
	})
}

// UnlinkSystemIntakeRelation clears all the relationship information on a system intake.
// This includes clearing the system relation type, contract name, contract number relationships, and CEDAR system relationships (TODO).
func UnlinkSystemIntakeRelation(
	ctx context.Context,
	store *storage.Store,
	intakeID uuid.UUID,
) (*models.SystemIntake, error) {
	return sqlutils.WithTransaction[models.SystemIntake](store, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}

		// Clear system relation type by setting to nil
		intake.SystemRelationType = nil

		// Clear contract name
		intake.ContractName = zero.StringFromPtr(nil)

		// Clear contract number relationships by setting an empty array of contract #'s
		// declare this as an explicit empty slice instead of `nil`
		// TODO: (Sam) update `SetSystemIntakeContractNumbers` to allow for `nil`
		if err = store.SetSystemIntakeContractNumbers(ctx, tx, intakeID, []string{}); err != nil {
			return nil, err
		}

		// Clear CEDAR system relationships
		if err = store.SetSystemIntakeSystems(ctx, tx, intakeID, []string{}); err != nil {
			return nil, err
		}

		// Update system intake
		updatedIntake, err := store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}

		return updatedIntake, nil
	})
}
