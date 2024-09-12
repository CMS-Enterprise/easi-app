package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/systemintake/formstate"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateSystemIntake creates a system intake.
func CreateSystemIntake(
	ctx context.Context,
	store *storage.Store,
	input models.CreateSystemIntakeInput,
) (*models.SystemIntake, error) {
	systemIntake := models.SystemIntake{
		EUAUserID:   null.StringFrom(appcontext.Principal(ctx).ID()),
		RequestType: models.SystemIntakeRequestType(input.RequestType),
		Requester:   input.Requester.Name,
		State:       models.SystemIntakeStateOpen,
		Step:        models.SystemIntakeStepINITIALFORM,
	}
	createdIntake, err := store.CreateSystemIntake(ctx, &systemIntake)
	return createdIntake, err
}

// CreateSystemIntakeContact creates a system intake's contact info.
func CreateSystemIntakeContact(
	ctx context.Context,
	store *storage.Store,
	input models.CreateSystemIntakeContactInput,
) (*models.CreateSystemIntakeContactPayload, error) {
	contact := &models.SystemIntakeContact{
		SystemIntakeID: input.SystemIntakeID,
		EUAUserID:      input.EuaUserID,
		Component:      input.Component,
		Role:           input.Role,
	}
	createdContact, err := store.CreateSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	return &models.CreateSystemIntakeContactPayload{
		SystemIntakeContact: createdContact,
	}, nil
}

// UpdateSystemIntakeContact updates a system intake's contact info.
func UpdateSystemIntakeContact(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeContactInput,
) (*models.CreateSystemIntakeContactPayload, error) {
	contact := &models.SystemIntakeContact{
		ID:             input.ID,
		SystemIntakeID: input.SystemIntakeID,
		EUAUserID:      input.EuaUserID,
		Component:      input.Component,
		Role:           input.Role,
	}

	updatedContact, err := store.UpdateSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	return &models.CreateSystemIntakeContactPayload{
		SystemIntakeContact: updatedContact,
	}, nil
}

// UpdateSystemIntakeRequestType updates a system intake's request type and returns the updated intake.
// It will return an error if the intake is not found by the ID, or the update fails for any reason.
func UpdateSystemIntakeRequestType(ctx context.Context, store *storage.Store, systemIntakeID uuid.UUID, newType models.SystemIntakeRequestType) (*models.SystemIntake, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	// Update request type and set UpdatedAt
	intake.RequestType = newType
	intake.UpdatedAt = helpers.PointerTo(time.Now())

	// Save intake to DB
	savedIntake, err := store.UpdateSystemIntake(ctx, intake)
	return savedIntake, err
}

// TODO: thes calls could largely be combined in a more general call to Update the System Intake. It would rely on a similar approach that was taken in TRB

// SystemIntakeUpdate takes a UpdateSystemIntakeRequestDetailsInput struct and updates the database with the provided information.
// It also updates the request form state to show in progress, unless the state was EDITS_REQUESTED
func SystemIntakeUpdate(ctx context.Context, store *storage.Store, fetchCedarSystem func(context.Context, string) (*models.CedarSystem, error), input models.UpdateSystemIntakeRequestDetailsInput) (*models.UpdateSystemIntakePayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	intake.RequestFormState = formstate.GetNewStateForUpdatedForm(intake.RequestFormState)

	intake.ProcessStatus = null.StringFromPtr(input.CurrentStage)
	intake.ProjectName = null.StringFromPtr(input.RequestName)
	intake.BusinessNeed = null.StringFromPtr(input.BusinessNeed)
	intake.Solution = null.StringFromPtr(input.BusinessSolution)
	intake.EASupportRequest = null.BoolFromPtr(input.NeedsEaSupport)
	intake.HasUIChanges = null.BoolFromPtr(input.HasUIChanges)
	intake.UsesAITech = null.BoolFromPtr(input.UsesAiTech)

	softwareAcq := models.SystemIntakeSoftwareAcquisition{
		ID:                 uuid.New(), // TODO: NJD - do this here? or before passing?
		SystemIntakeID:     intake.ID,
		UsingSoftware:      null.StringFromPtr(input.SoftwareAcquisition.UsingSoftware),
		AcuqisitionMethods: input.SoftwareAcquisition.AcuqisitionMethods}

	store.UpdateSystemIntakeSoftwareAcquisition(ctx, input.ID, &softwareAcq)

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
	return &models.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}

// SystemIntakeUpdateContactDetails updates the various contacts requested from the input.
// It also updates the request form state to show in progress, unless the state was EDITS_REQUESTED
func SystemIntakeUpdateContactDetails(ctx context.Context, store *storage.Store, input models.UpdateSystemIntakeContactDetailsInput) (*models.UpdateSystemIntakePayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	intake.RequestFormState = formstate.GetNewStateForUpdatedForm(intake.RequestFormState)

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
	return &models.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}

// SystemIntakeUpdateContractDetails updates specific contract information about a system intake
// It also updates the request form state to show in progress, unless the state was EDITS_REQUESTED
func SystemIntakeUpdateContractDetails(ctx context.Context, store *storage.Store, input models.UpdateSystemIntakeContractDetailsInput) (*models.UpdateSystemIntakePayload, error) {
	return sqlutils.WithTransactionRet[*models.UpdateSystemIntakePayload](ctx, store, func(tx *sqlx.Tx) (*models.UpdateSystemIntakePayload, error) {

		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.ID)
		if err != nil {
			return nil, err
		}

		intake.RequestFormState = formstate.GetNewStateForUpdatedForm(intake.RequestFormState)

		if input.FundingSources != nil && input.FundingSources.FundingSources != nil {
			intake.ExistingFunding = null.BoolFromPtr(input.FundingSources.ExistingFunding)
			if intake.ExistingFunding.ValueOrZero() {
				fundingSources := make([]*models.SystemIntakeFundingSource, 0, len(input.FundingSources.FundingSources))
				for _, fundingSourceInput := range input.FundingSources.FundingSources {
					fundingSources = append(fundingSources, &models.SystemIntakeFundingSource{
						SystemIntakeID: intake.ID,
						Source:         null.StringFromPtr(fundingSourceInput.Source),
						FundingNumber:  null.StringFromPtr(fundingSourceInput.FundingNumber),
					})
				}

				_, err = store.UpdateSystemIntakeFundingSourcesNP(ctx, tx, input.ID, fundingSources)
				if err != nil {
					return nil, err
				}
			} else {
				// Delete existing funding source records
				_, err = store.UpdateSystemIntakeFundingSourcesNP(ctx, tx, input.ID, nil)
				if err != nil {
					return nil, err
				}
			}
		}

		if input.Costs != nil {
			intake.CostIncreaseAmount = null.StringFromPtr(input.Costs.ExpectedIncreaseAmount)
			intake.CostIncrease = null.StringFromPtr(input.Costs.IsExpectingIncrease)

			if input.Costs.IsExpectingIncrease != nil {
				if *input.Costs.IsExpectingIncrease == "YES" {
					intake.CostIncreaseAmount = null.StringFromPtr(input.Costs.ExpectedIncreaseAmount)
					intake.CostIncrease = null.StringFromPtr(input.Costs.IsExpectingIncrease)
				}
				if *input.Costs.IsExpectingIncrease != "YES" {
					intake.CostIncreaseAmount = null.StringFromPtr(nil)
					intake.CostIncrease = null.StringFromPtr(input.Costs.IsExpectingIncrease)
				}
			}
		}

		if input.AnnualSpending != nil {
			intake.CurrentAnnualSpending = null.StringFromPtr(input.AnnualSpending.CurrentAnnualSpending)
			intake.CurrentAnnualSpendingITPortion = null.StringFromPtr(input.AnnualSpending.CurrentAnnualSpendingITPortion)
			intake.PlannedYearOneSpending = null.StringFromPtr(input.AnnualSpending.PlannedYearOneSpending)
			intake.PlannedYearOneSpendingITPortion = null.StringFromPtr(input.AnnualSpending.PlannedYearOneSpendingITPortion)
		}

		if input.Contract != nil {
			contractNumbers := input.Contract.Numbers

			// set the fields to the values we receive
			intake.ExistingContract = null.StringFromPtr(input.Contract.HasContract)
			intake.Contractor = null.StringFromPtr(input.Contract.Contractor)
			intake.ContractVehicle = null.StringFromPtr(nil) // blank this out in favor of the newer ContractNumber field (see EASI-1977)

			if input.Contract.StartDate != nil {
				intake.ContractStartDate = input.Contract.StartDate
			}
			if input.Contract.EndDate != nil {
				intake.ContractEndDate = input.Contract.EndDate
			}

			// in case hasContract has changed, clear the other fields
			if input.Contract.HasContract != nil {
				if *input.Contract.HasContract == "NOT_STARTED" || *input.Contract.HasContract == "NOT_NEEDED" {
					intake.Contractor = null.StringFromPtr(nil)
					intake.ContractVehicle = null.StringFromPtr(nil)
					// declare explicitly as an empty slice instead of `nil`
					// TODO: (Sam) update contract number storage methods to accept `nil`
					contractNumbers = []string{}
					intake.ContractStartDate = nil
					intake.ContractEndDate = nil
				}
			}

			// set contract numbers here
			if err = store.SetSystemIntakeContractNumbers(ctx, tx, intake.ID, contractNumbers); err != nil {
				return nil, err
			}
		}

		savedIntake, err := store.UpdateSystemIntakeNP(ctx, tx, intake)
		return &models.UpdateSystemIntakePayload{
			SystemIntake: savedIntake,
		}, err

	})
}

// SubmitIntake is the resolver to submit the initial request form of a system intake
func SubmitIntake(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	submitIntake func(context.Context, *models.SystemIntake, *models.Action) error,
	input models.SubmitIntakeInput,
) (*models.UpdateSystemIntakePayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	actorEUAID := appcontext.Principal(ctx).ID()
	actorInfo, err := fetchUserInfo(ctx, actorEUAID)
	if err != nil {
		return nil, err
	}

	err = submitIntake(
		ctx,
		intake,
		&models.Action{
			IntakeID:       &input.ID,
			ActionType:     models.ActionTypeSUBMITINTAKE,
			ActorEUAUserID: actorEUAID,
			ActorName:      actorInfo.DisplayName,
			ActorEmail:     actorInfo.Email,
			Step:           &intake.Step,
		})
	if err != nil {
		return nil, err
	}

	intake, err = store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err

}

// SystemIntakes returns a list of System Intakes for the admin table (which is why it uses the FetchSystemIntakesByStateForAdmins store method)
func SystemIntakes(ctx context.Context, store *storage.Store, openRequests bool) ([]*models.SystemIntake, error) {
	var stateFilter models.SystemIntakeState
	if openRequests {
		stateFilter = models.SystemIntakeStateOpen
	} else {
		stateFilter = models.SystemIntakeStateClosed
	}

	intakes, err := store.FetchSystemIntakesByStateForAdmins(ctx, stateFilter)
	if err != nil {
		return nil, err
	}

	return intakes, nil
}

func SystemIntakesWithReviewRequested(ctx context.Context, store *storage.Store) ([]*models.SystemIntake, error) {
	userID := appcontext.Principal(ctx).Account().ID
	return store.FetchSystemIntakesWithReviewRequested(ctx, userID)
}

func GetMySystemIntakes(ctx context.Context, store *storage.Store) ([]*models.SystemIntake, error) {
	return store.GetMySystemIntakes(ctx)
}
