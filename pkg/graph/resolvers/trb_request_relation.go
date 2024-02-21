package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// SetTRBRequestRelationNewSystem effectively clears the relationship between a TRB Request
// and any previously set list of CEDAR systems and contract/service names. It also
// sets any contract number relationships
func SetTRBRequestRelationNewSystem(
	ctx context.Context,
	store *storage.Store,
	input model.SetTRBRequestRelationNewSystemInput,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransaction[models.TRBRequest](store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, input.TrbRequestID)
		if err != nil {
			return nil, err
		}

		// Clear contract name
		trbRequest.ContractName = zero.StringFromPtr(nil)
		trbRequest.SystemRelationType = helpers.PointerTo(models.RelationTypeNewSystem)
		updatedTRBRequest, err := store.UpdateTRBRequestNP(ctx, tx, trbRequest)
		if err != nil {
			return nil, err
		}

		// TODO: Store -> Delete CEDAR relationships

		// Set contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, input.TrbRequestID, input.ContractNumbers); err != nil {
			return nil, err
		}

		return updatedTRBRequest, nil
	})
}

// SetTRBRequestRelationExistingSystem sets the relationship between a TRB Request and
// a list of CEDAR systems by setting an array of CEDAR system IDs, clearing any data about
// contract/service names, and setting any contract number relationships
func SetTRBRequestRelationExistingSystem(
	ctx context.Context,
	store *storage.Store,
	input model.SetTRBRequestRelationExistingSystemInput,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransaction[models.TRBRequest](store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, input.TrbRequestID)
		if err != nil {
			return nil, err
		}

		trbRequest.ContractName = zero.StringFromPtr(nil)
		trbRequest.SystemRelationType = helpers.PointerTo(models.RelationTypeExistingSystem)
		updatedTRBRequest, err := store.UpdateTRBRequestNP(ctx, tx, trbRequest)
		if err != nil {
			return nil, err
		}
		// TODO: Store -> Add CEDAR relationships

		// Set contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, input.TrbRequestID, input.ContractNumbers); err != nil {
			return nil, err
		}

		return updatedTRBRequest, nil
	})
}

// SetTRBRequestRelationExistingService sets the relationship between a TRB Request and
// an existing service by setting a free-text contract/service name, clearing relationships between
// TRB Requests and CEDAR systems, and setting any contract number relationships
func SetTRBRequestRelationExistingService(
	ctx context.Context,
	store *storage.Store,
	input model.SetTRBRequestRelationExistingServiceInput,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransaction[models.TRBRequest](store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, input.TrbRequestID)
		if err != nil {
			return nil, err
		}

		// set contract name
		trbRequest.ContractName = zero.StringFrom(input.ContractName)
		trbRequest.SystemRelationType = helpers.PointerTo(models.RelationTypeExistingService)
		updatedTRBRequest, err := store.UpdateTRBRequestNP(ctx, tx, trbRequest)
		if err != nil {
			return nil, err
		}
		// TODO: Store -> Delete CEDAR relationships

		// Set contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, input.TrbRequestID, input.ContractNumbers); err != nil {
			return nil, err
		}

		return updatedTRBRequest, nil
	})
}

// UnlinkTRBRequestRelation clears all the relationship information on a TRB Request
// This includes clearing the system relation type, contract name, contract number relationships, and CEDAR system relationships
func UnlinkTRBRequestRelation(
	ctx context.Context,
	store *storage.Store,
	trbRequestID uuid.UUID,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransaction[models.TRBRequest](store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, trbRequestID)
		if err != nil {
			return nil, err
		}

		// Clear system relation type by setting to nil
		trbRequest.SystemRelationType = nil

		// Clear contract name
		trbRequest.ContractName = zero.StringFromPtr(nil)

		// update TRB Request
		updatedTRBRequest, err := store.UpdateTRBRequestNP(ctx, tx, trbRequest)
		if err != nil {
			return nil, err
		}

		// TODO: Store -> Delete CEDAR relationships

		// TODO: Store -> Delete contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, trbRequestID, []string{}); err != nil {
			return nil, err
		}

		return updatedTRBRequest, nil
	})
}
