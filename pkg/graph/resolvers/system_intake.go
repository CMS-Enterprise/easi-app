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
	//TODO: move to helper function? Maybe in it's own package?
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

// SystemIntakeUpdateContactDetails updates the various contacts requested from the input.
// It also updates the request form state to show in progress, unless the state was EDITS_REQUESTED
func SystemIntakeUpdateContactDetails(ctx context.Context, store *storage.Store, input model.UpdateSystemIntakeContactDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	//TODO: move to helper function? Maybe in it's own package?
	if intake.RequestFormState != models.SIRFSEditsRequested {
		// If the request is in request edits, it should stay that way until submitted.
		//If submitted and edited again, it should change to in progress.
		intake.RequestFormState = models.SIRFSInProgress
	}

	intake.Requester = input.Requester.Name
	intake.Component = null.StringFrom(input.Requester.Component)
	intake.BusinessOwner = null.StringFrom(input.BusinessOwner.Name)
	intake.BusinessOwnerComponent = null.StringFrom(input.BusinessOwner.Component)
	intake.ProductManager = null.StringFrom(input.ProductManager.Name)
	intake.ProductManagerComponent = null.StringFrom(input.ProductManager.Component)

	if input.Isso.IsPresent != nil && *input.Isso.IsPresent {
		intake.ISSOName = null.StringFromPtr(input.Isso.Name)
	} else {
		intake.ISSOName = null.StringFromPtr(nil)
	}

	if input.GovernanceTeams.IsPresent != nil {
		trbCollaboratorName := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "technicalReviewBoard" {
				trbCollaboratorName = null.StringFrom(team.Collaborator)
			}
		}
		intake.TRBCollaboratorName = trbCollaboratorName

		oitCollaboratorName := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "securityPrivacy" {
				oitCollaboratorName = null.StringFrom(team.Collaborator)
			}
		}
		intake.OITSecurityCollaboratorName = oitCollaboratorName

		eaCollaboratorName := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "enterpriseArchitecture" {
				eaCollaboratorName = null.StringFrom(team.Collaborator)
			}
		}
		intake.EACollaboratorName = eaCollaboratorName
	} else {
		intake.TRBCollaboratorName = null.StringFromPtr(nil)
		intake.OITSecurityCollaboratorName = null.StringFromPtr(nil)
		intake.EACollaboratorName = null.StringFromPtr(nil)
	}

	savedIntake, err := store.UpdateSystemIntake(ctx, intake)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}
