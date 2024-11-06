package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// SetTRBRequestRelationNewSystem effectively clears the relationship between a TRB Request
// and any previously set list of CEDAR systems and contract/service names. It also
// sets any contract number relationships
func SetTRBRequestRelationNewSystem(
	ctx context.Context,
	store *storage.Store,
	input models.SetTRBRequestRelationNewSystemInput,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, input.TrbRequestID)
		if err != nil {
			return nil, err
		}

		// Delete CEDAR relationships
		if err := store.SetTRBRequestSystems(ctx, tx, input.TrbRequestID, []string{}); err != nil {
			return nil, err
		}

		// Set contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, input.TrbRequestID, input.ContractNumbers); err != nil {
			return nil, err
		}

		// Clear contract name
		trbRequest.ContractName = zero.StringFromPtr(nil)
		trbRequest.SystemRelationType = helpers.PointerTo(models.RelationTypeNewSystem)
		return store.UpdateTRBRequestNP(ctx, tx, trbRequest)
	})
}

// SetTRBRequestRelationExistingSystem sets the relationship between a TRB Request and
// a list of CEDAR systems by setting an array of CEDAR system IDs, clearing any data about
// contract/service names, and setting any contract number relationships
func SetTRBRequestRelationExistingSystem(
	ctx context.Context,
	store *storage.Store,
	getCedarSystem func(ctx context.Context, systemID string) (*models.CedarSystem, error),
	input models.SetTRBRequestRelationExistingSystemInput,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, input.TrbRequestID)
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
		if err := store.SetTRBRequestSystems(ctx, tx, input.TrbRequestID, input.CedarSystemIDs); err != nil {
			return nil, err
		}

		// Set contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, input.TrbRequestID, input.ContractNumbers); err != nil {
			return nil, err
		}

		trbRequest.ContractName = zero.StringFromPtr(nil)
		trbRequest.SystemRelationType = helpers.PointerTo(models.RelationTypeExistingSystem)
		return store.UpdateTRBRequestNP(ctx, tx, trbRequest)
	})
}

// SetTRBRequestRelationExistingService sets the relationship between a TRB Request and
// an existing service by setting a free-text contract/service name, clearing relationships between
// TRB Requests and CEDAR systems, and setting any contract number relationships
func SetTRBRequestRelationExistingService(
	ctx context.Context,
	store *storage.Store,
	input models.SetTRBRequestRelationExistingServiceInput,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, input.TrbRequestID)
		if err != nil {
			return nil, err
		}

		// Delete CEDAR relationships
		if err := store.SetTRBRequestSystems(ctx, tx, input.TrbRequestID, []string{}); err != nil {
			return nil, err
		}

		// Set contract number relationships
		if err := store.SetTRBRequestContractNumbers(ctx, tx, input.TrbRequestID, input.ContractNumbers); err != nil {
			return nil, err
		}

		// set contract name
		trbRequest.ContractName = zero.StringFrom(input.ContractName)
		trbRequest.SystemRelationType = helpers.PointerTo(models.RelationTypeExistingService)
		return store.UpdateTRBRequestNP(ctx, tx, trbRequest)
	})
}

// UnlinkTRBRequestRelation clears all the relationship information on a TRB Request
// This includes clearing the system relation type, contract name, contract number relationships, and CEDAR system relationships
func UnlinkTRBRequestRelation(
	ctx context.Context,
	store *storage.Store,
	trbRequestID uuid.UUID,
) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		// Fetch TRB Request by ID
		trbRequest, err := store.GetTRBRequestByIDNP(ctx, tx, trbRequestID)
		if err != nil {
			return nil, err
		}

		// Delete CEDAR relationships
		if err := store.SetTRBRequestSystems(ctx, tx, trbRequestID, []string{}); err != nil {
			return nil, err
		}

		// Delete contract number relationships
		// declare this as an explicit empty slice instead of `nil`
		// TODO: (Sam) update `SetTRBRequestContractNumbers` to allow for `nil`
		if err := store.SetTRBRequestContractNumbers(ctx, tx, trbRequestID, []string{}); err != nil {
			return nil, err
		}

		// Clear system relation type by setting to nil
		trbRequest.SystemRelationType = nil

		// Clear contract name
		trbRequest.ContractName = zero.StringFromPtr(nil)

		// update TRB Request
		return store.UpdateTRBRequestNP(ctx, tx, trbRequest)
	})
}
