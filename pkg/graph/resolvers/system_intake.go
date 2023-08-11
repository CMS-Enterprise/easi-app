package resolvers

import (
	"context"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// SystemIntakeUpdate takes a UpdateSystemIntakeRequestDetailsInput struct and updates the database with the provided information.
// It also updates the request form state to show in progress, unless the state was EDITS_REQUESTED
func SystemIntakeUpdate(ctx context.Context, store *storage.Store, fetchCedarSystem func(context.Context, string) (*models.CedarSystem, error), input model.UpdateSystemIntakeRequestDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	//TODO: update the form state here
	if intake.RequestFormState != models.SIRFSEditsRequested {
		// If the request is in request edits, it should stay that way until submitted.
		//If submitted and edited again, it should change to in progress.
		intake.RequestFormState = models.SIRFSInProgress
	}
	intake.ProcessStatus = null.StringFromPtr(input.CurrentStage)
	intake.ProjectName = null.StringFromPtr(input.RequestName)
	intake.BusinessNeed = null.StringFromPtr(input.BusinessNeed)
	intake.Solution = null.StringFromPtr(input.BusinessSolution)
	intake.EASupportRequest = null.BoolFromPtr(input.NeedsEaSupport)
	intake.HasUIChanges = null.BoolFromPtr(input.HasUIChanges)

	cedarSystemID := null.StringFromPtr(input.CedarSystemID)
	cedarSystemIDStr := cedarSystemID.ValueOrZero()
	if input.CedarSystemID != nil && len(*input.CedarSystemID) > 0 {
		_, err = fetchCedarSystem(ctx, cedarSystemIDStr)
		if err != nil {
			return nil, err
		}
		intake.CedarSystemID = null.StringFromPtr(input.CedarSystemID)
	}

	savedIntake, err := store.UpdateSystemIntake(ctx, intake)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}
