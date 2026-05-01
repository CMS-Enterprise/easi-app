package resolvers

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/systemintake/formstate"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/services"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

// CreateSystemIntake creates a system intake.
func CreateSystemIntake(
	ctx context.Context,
	store *storage.Store,
	input models.CreateSystemIntakeInput,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.SystemIntake, error) {
	systemIntake := models.SystemIntake{
		EUAUserID:   null.StringFrom(appcontext.Principal(ctx).ID()),
		RequestType: models.SystemIntakeRequestType(input.RequestType),
		Requester:   input.Requester.Name,
		State:       models.SystemIntakeStateOpen,
		Step:        models.SystemIntakeStepINITIALFORM,
	}

	intakeRetFromTransaction, err := sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntake, error) {
		createdIntake, err := storage.CreateSystemIntake(ctx, tx, &systemIntake)
		if err != nil {
			return nil, err
		}
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		_, err2 := CreateSystemIntakeContact(ctx, logger, principal, tx, models.CreateSystemIntakeContactInput{
			EuaUserID:      principal.ID(),
			SystemIntakeID: createdIntake.ID,
			Roles: []models.SystemIntakeContactRole{
				models.SystemIntakeContactRolePLACEHOLDER,
			},
			Component:   models.SystemIntakeContactComponentPLACEHOLDER,
			IsRequester: true,
		},
			getAccountInformation,
		)
		if err2 != nil {
			return nil, err2
		}

		return createdIntake, nil
	})
	return intakeRetFromTransaction, err
}

func authorizeUserCanViewSystemIntake(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
) error {
	// admins can always view
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return nil
	}

	// the requester can view
	if userOwnsSystemIntake(ctx, intake) {
		return nil
	}

	grbUsers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
	if err != nil {
		return err
	}

	if account := appcontext.Principal(ctx).Account(); account != nil {
		if isGRBViewer := slices.ContainsFunc(grbUsers, func(reviewer *models.SystemIntakeGRBReviewer) bool {
			return reviewer.UserID == account.ID
		}); isGRBViewer {
			return nil
		}
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to fetch system intake")}
}

func userOwnsSystemIntake(ctx context.Context, intake *models.SystemIntake) bool {
	if intake == nil {
		return false
	}

	principal := appcontext.Principal(ctx)
	if !principal.AllowEASi() {
		return false
	}

	account := principal.Account()
	if account == nil {
		return false
	}

	requester, err := SystemIntakeContactGetRequester(ctx, intake.ID)
	if err != nil {
		return false
	}

	if requester != nil && requester.UserID != uuid.Nil {
		return requester.UserID == account.ID
	}

	if intake.EUAUserID.IsZero() {
		return false
	}

	return account.Username == intake.EUAUserID.String
}

func authorizeUserCanEditOwnSystemIntake(
	ctx context.Context,
	intake *models.SystemIntake,
) error {
	if userOwnsSystemIntake(ctx, intake) {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to edit system intake")}
}

func authorizeUserCanManageSystemIntakeContacts(
	ctx context.Context,
	intake *models.SystemIntake,
) error {
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return nil
	}

	if userOwnsSystemIntake(ctx, intake) {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to manage system intake contacts")}
}

func authorizeUserCanManageSystemIntakeRelations(
	ctx context.Context,
	intake *models.SystemIntake,
) error {
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return nil
	}

	if userOwnsSystemIntake(ctx, intake) {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to manage system intake relations")}
}

func authorizeUserCanManageSystemIntakeGRBReview(ctx context.Context) error {
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to manage system intake GRB review")}
}

func userCanViewSystemIntakeGRBReviewerIdentities(
	ctx context.Context,
	reviewers []*models.SystemIntakeGRBReviewer,
) bool {
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return true
	}

	if account := appcontext.Principal(ctx).Account(); account != nil {
		return slices.ContainsFunc(reviewers, func(reviewer *models.SystemIntakeGRBReviewer) bool {
			return reviewer.UserID == account.ID
		})
	}

	return false
}

func authorizeUserCanManageSystemIntakeAdminWorkflow(ctx context.Context) error {
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to manage system intake admin workflow")}
}

func authorizeUserCanDeleteSystemIntakeGRBPresentationLinks(
	ctx context.Context,
	intake *models.SystemIntake,
) error {
	if ok := services.AuthorizeRequireGRTJobCode(ctx); ok {
		return nil
	}

	if userOwnsSystemIntake(ctx, intake) {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to delete system intake GRB presentation links")}
}

func filterVisibleSystemIntakes(
	ctx context.Context,
	store *storage.Store,
	intakes []*models.SystemIntake,
) ([]*models.SystemIntake, error) {
	visible := make([]*models.SystemIntake, 0, len(intakes))

	for _, intake := range intakes {
		err := authorizeUserCanViewSystemIntake(ctx, store, intake)
		if err == nil {
			visible = append(visible, intake)
			continue
		}

		var unauthorizedErr *apperrors.UnauthorizedError
		if errors.As(err, &unauthorizedErr) {
			continue
		}

		return nil, err
	}

	return visible, nil
}

// UpdateSystemIntakeRequestType updates a system intake's request type and returns the updated intake.
// It will return an error if the intake is not found by the ID, or the update fails for any reason.
func UpdateSystemIntakeRequestType(ctx context.Context, store *storage.Store, systemIntakeID uuid.UUID, newType models.SystemIntakeRequestType) (*models.SystemIntake, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	if err := authorizeUserCanEditOwnSystemIntake(ctx, intake); err != nil {
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
func SystemIntakeUpdate(ctx context.Context, store *storage.Store, fetchCedarSystem func(context.Context, uuid.UUID) (*models.CedarSystem, error), input models.UpdateSystemIntakeRequestDetailsInput) (*models.UpdateSystemIntakePayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	if err := authorizeUserCanEditOwnSystemIntake(ctx, intake); err != nil {
		return nil, err
	}

	intake.RequestFormState = formstate.GetNewStateForUpdatedForm(intake.RequestFormState)

	intake.ProcessStatus = null.StringFromPtr(input.CurrentStage)
	intake.ProjectName = null.StringFromPtr(input.RequestName)
	intake.ProjectAcronym = null.StringFromPtr(input.ProjectAcronym)
	intake.BusinessNeed = null.StringFromPtr(input.BusinessNeed)
	intake.Solution = null.StringFromPtr(input.BusinessSolution)
	intake.EASupportRequest = null.BoolFromPtr(input.NeedsEaSupport)
	intake.HasUIChanges = null.BoolFromPtr(input.HasUIChanges)
	intake.UsesAITech = null.BoolFromPtr(input.UsesAiTech)
	intake.UsingSoftware = zero.StringFromPtr(input.UsingSoftware)

	// Create string array from SoftwareAcqisitionMethods enum array
	intake.AcquisitionMethods = lo.Map(input.AcquisitionMethods, func(acqMethod models.SystemIntakeSoftwareAcquisitionMethods, idx int) string {
		return acqMethod.String()
	})

	if input.CedarSystemID != nil && *input.CedarSystemID != uuid.Nil {
		_, err = fetchCedarSystem(ctx, *input.CedarSystemID)
		if err != nil {
			return nil, err
		}

		intake.CedarSystemID = input.CedarSystemID
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

	if err := authorizeUserCanEditOwnSystemIntake(ctx, intake); err != nil {
		return nil, err
	}

	intake.RequestFormState = formstate.GetNewStateForUpdatedForm(intake.RequestFormState)

	if input.GovernanceTeams.IsPresent != nil {
		intake.GovernanceTeamsIsPresent = null.BoolFromPtr(input.GovernanceTeams.IsPresent)

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

		collaboratorName508 := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "clearanceOfficer508" {
				collaboratorName508 = null.StringFrom(team.Collaborator)
			}
		}
		intake.CollaboratorName508 = collaboratorName508
	} else {
		intake.TRBCollaboratorName = null.StringFromPtr(nil)
		intake.OITSecurityCollaboratorName = null.StringFromPtr(nil)
		intake.CollaboratorName508 = null.StringFromPtr(nil)
		intake.GovernanceTeamsIsPresent = null.BoolFromPtr(nil)
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

		intake, err := storage.FetchSystemIntakeByIDNP(ctx, tx, input.ID)
		if err != nil {
			return nil, err
		}

		if err := authorizeUserCanEditOwnSystemIntake(ctx, intake); err != nil {
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
						Investment:     null.StringFromPtr(fundingSourceInput.Investment),
						ProjectNumber:  null.StringFromPtr(fundingSourceInput.ProjectNumber),
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

	if err := authorizeUserCanEditOwnSystemIntake(ctx, intake); err != nil {
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
	if err := authorizeUserCanManageSystemIntakeAdminWorkflow(ctx); err != nil {
		return nil, err
	}

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
	p := appcontext.Principal(ctx)
	userAccount := p.Account()
	if userAccount == nil {
		return nil, fmt.Errorf("there is no user account present")
	}

	return store.GetMySystemIntakes(ctx, userAccount.ID)
}

const maxEUAsPerRequest = 200

func GetRequesterUpdateEmailData(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
) ([]*models.RequesterUpdateEmailData, error) {
	if !appcontext.Principal(ctx).AllowGRT() {
		return nil, &apperrors.UnauthorizedError{Err: errors.New("unauthorized to fetch requester update email data")}
	}

	// first, get data from store
	data, err := store.GetRequesterUpdateEmailData(ctx)
	if err != nil {
		return nil, err
	}

	var (
		euaIDs []string
		euaSet = map[string]struct{}{}
	)

	for _, item := range data {
		// de-duplicate
		if _, seen := euaSet[item.EuaUserID]; seen {
			continue
		}

		euaSet[item.EuaUserID] = helpers.EmptyStruct
		euaIDs = append(euaIDs, item.EuaUserID)
	}

	// chunk the data into the maximum, which is 200
	var userData []*models.UserInfo
	for chunk := range slices.Chunk(euaIDs, maxEUAsPerRequest) {
		// then, get user data from Okta
		res, err := fetchUserInfos(ctx, chunk)
		if err != nil {
			return nil, err
		}

		userData = append(userData, res...)
	}

	// map emails for ease
	cache := map[string]models.EmailAddress{}

	for _, user := range userData {
		if user == nil {
			continue
		}

		cache[user.Username] = user.Email
	}

	// then, match up emails from okta
	for i, item := range data {
		if item == nil {
			continue
		}

		val, ok := cache[item.EuaUserID]
		if !ok {
			continue
		}

		data[i].RequesterEmail = val
	}

	return data, nil
}

func UpdateSystemIntakeAdminLead(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeAdminLeadInput,
) (*models.UpdateSystemIntakePayload, error) {
	if err := authorizeUserCanManageSystemIntakeAdminWorkflow(ctx); err != nil {
		return nil, err
	}

	savedAdminLead, err := store.UpdateAdminLead(ctx, input.ID, input.AdminLead)
	systemIntake := models.SystemIntake{
		AdminLead: null.StringFrom(savedAdminLead),
		ID:        input.ID,
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: &systemIntake,
	}, err
}

func UpdateSystemIntakeReviewDates(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeReviewDatesInput,
) (*models.UpdateSystemIntakePayload, error) {
	if err := authorizeUserCanManageSystemIntakeAdminWorkflow(ctx); err != nil {
		return nil, err
	}

	intake, err := store.UpdateReviewDates(ctx, input.ID, input.GrbDate, input.GrtDate)
	return &models.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func GetSystemIntake(
	ctx context.Context,
	store *storage.Store,
	id uuid.UUID,
) (*models.SystemIntake, error) {
	intake, err := dataloaders.GetSystemIntakeByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if err := authorizeUserCanViewSystemIntake(ctx, store, intake); err != nil {
		return nil, err
	}

	return intake, nil
}

func GetSystemIntakesWithLCIDs(
	ctx context.Context,
	store *storage.Store,
) ([]*models.SystemIntake, error) {
	if err := authorizeUserCanManageSystemIntakeAdminWorkflow(ctx); err != nil {
		return nil, err
	}

	return store.GetSystemIntakesWithLCIDs(ctx)
}

func ArchiveSystemIntake(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	id uuid.UUID,
) (*models.SystemIntake, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, id)
	if err != nil {
		return nil, err
	}

	currentStatus, err := IntakeFormStatus(intake)
	if err != nil {
		return nil, err
	}

	if currentStatus != models.ITGISReady && currentStatus != models.ITGISInProgress {
		return nil, errors.New("cannot remove system intake unless in Ready or In Progress status")
	}

	if !userOwnsSystemIntake(ctx, intake) {
		return nil, errors.New("user is unauthorized to archive system intake")
	}

	now := helpers.PointerTo(time.Now())

	if intake.BusinessCaseID != nil {
		businessCase, err := store.FetchBusinessCaseByID(ctx, *intake.BusinessCaseID)
		if err != nil {
			return nil, err
		}

		if businessCase.Status != models.BusinessCaseStatusCLOSED {
			businessCase.UpdatedAt = now
			businessCase.Status = models.BusinessCaseStatusCLOSED

			if _, err := store.UpdateBusinessCase(ctx, businessCase); err != nil {
				return nil, err
			}
		}
	}

	intake.UpdatedAt = now
	intake.ArchivedAt = now

	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	if intake.SubmittedAt != nil {
		if err := emailClient.SendWithdrawRequestEmail(ctx, intake.ProjectName.String); err != nil {
			return nil, err
		}
	}

	return updatedIntake, nil
}
