package main

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// creates, fills out the initial request form, and submits a system intake
func makeSystemIntakeAndSubmit(
	requestName string,
	intakeID *uuid.UUID,
	requesterEUAID string,
	logger *zap.Logger,
	store *storage.Store,
) *models.SystemIntake {
	intake := makeSystemIntake(requestName, intakeID, requesterEUAID, logger, store)
	return submitSystemIntake(logger, store, intake)
}

// creates an intake and fills out the initial request form
func makeSystemIntake(
	requestName string,
	intakeID *uuid.UUID,
	requesterEUAID string,
	logger *zap.Logger,
	store *storage.Store,
) *models.SystemIntake {
	intake := createSystemIntake(
		intakeID,
		logger,
		store,
		requesterEUAID,
		"Requester Name",
		models.SystemIntakeRequestTypeNEW,
	)
	return fillOutInitialIntake(requestName, logger, store, intake)
}

// updates an intake and fills out the initial request form
func fillOutInitialIntake(
	requestName string,
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	intake = updateSystemIntakeRequestDetails(logger, store, intake,
		requestName,
		"An intense business need",
		"with a great business solution",
		true,
		"Some CEDAR System ID",
		"the current stage",
		true,
	)
	updateSystemIntakeContact(logger, store, intake,
		"USR1",
		"Center for Medicare",
		"Requester",
	)
	createSystemIntakeContact(logger, store, intake,
		"A11Y",
		"Center for Medicare",
		"Business Owner",
	)
	createSystemIntakeContact(logger, store, intake,
		"OQYV",
		"Center for Medicare",
		"Product Manager",
	)
	createSystemIntakeContact(logger, store, intake,
		"GP87",
		"Center for Medicare",
		"ISSO",
	)
	intake = updateSystemIntakeContactDetails(logger, store, intake,
		"User One",
		"Office of the Actuary",
		"Ally Anderson",
		"Office of Minority Health",
		"Hallie O'Hara",
		"Emergency Preparedness and Response Operations",
		true,
		"Leatha Gorczany",
	)
	return updateSystemIntakeContractDetails(logger, store, intake)
}

func submitSystemIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	userEUA := intake.EUAUserID.ValueOrZero()
	if userEUA == "" {
		userEUA = mock.PrincipalUser
	}
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, userEUA)
	// until the submit function is refactored out of services, manually submit
	// NOTE: does not send emails
	mockSubmitIntake := func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		updatedTime := time.Now()
		intake.SubmittedAt = &updatedTime
		intake.UpdatedAt = &updatedTime

		intake.RequestFormState = models.SIRFSSubmitted
		_, err := store.UpdateSystemIntake(ctx, intake)
		if err != nil {
			panic(err)
		}
		_, err = store.CreateAction(ctx, action)
		if err != nil {
			panic(err)
		}
		return nil
	}
	input := model.SubmitIntakeInput{
		ID: intake.ID,
	}
	payload, err := resolvers.SubmitIntake(ctx, store, mock.FetchUserInfoMock, mockSubmitIntake, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

// This is a v2 function that uses the resolver to create the intake
func createSystemIntake(
	intakeID *uuid.UUID,
	logger *zap.Logger,
	store *storage.Store,
	requesterEUAID string,
	requesterName string,
	requestType models.SystemIntakeRequestType,
) *models.SystemIntake {
	ctx := context.Background()
	var requesterEUAIDPtr *string
	if requesterEUAID != "" {
		ctx = mock.CtxWithLoggerAndPrincipal(logger, store, requesterEUAID)
		requesterEUAIDPtr = &requesterEUAID
	}
	// The resolver requires an EUA ID and creates a random intake ID.
	// Only use the resolver if there is no pre-made intake ID and the Requester EUA is given.
	if intakeID == nil && requesterEUAIDPtr != nil {
		input := model.CreateSystemIntakeInput{
			RequestType: requestType,
			Requester: &model.SystemIntakeRequesterInput{
				Name: requesterName,
			},
		}
		intake, err := resolvers.CreateSystemIntake(ctx, store, input)
		if err != nil {
			panic(err)
		}
		return intake
	}
	// We must use the store method to use a pre-made ID or if the requester EUA isn't given
	i := models.SystemIntake{
		ID:          *intakeID,
		EUAUserID:   null.StringFromPtr(requesterEUAIDPtr),
		RequestType: requestType,
		Requester:   requesterName,
		State:       models.SystemIntakeStateOPEN,
		Step:        models.SystemIntakeStepINITIALFORM,
	}
	intake, err := store.CreateSystemIntake(ctx, &i)
	if err != nil {
		panic(err)
	}
	return intake
}

// This is a v2 function that uses the resolver to fill in an intake's request details
func updateSystemIntakeRequestDetails(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	requestName string,
	businessNeed string,
	businessSolution string,
	needsEaSupport bool,
	currentStage string,
	cedarSystemID string,
	hasUIChanges bool,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intake.EUAUserID.ValueOrZero())
	input := model.UpdateSystemIntakeRequestDetailsInput{
		ID:               intake.ID,
		RequestName:      &requestName,
		BusinessNeed:     &businessNeed,
		BusinessSolution: &businessSolution,
		NeedsEaSupport:   &needsEaSupport,
		CurrentStage:     &currentStage,
		CedarSystemID:    &cedarSystemID,
		HasUIChanges:     &hasUIChanges,
	}
	fetchCedarSystemMock := func(context.Context, string) (*models.CedarSystem, error) {
		return &models.CedarSystem{}, nil
	}
	payload, err := resolvers.SystemIntakeUpdate(ctx, store, fetchCedarSystemMock, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

func createSystemIntakeContact(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	component string,
	role string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intake.EUAUserID.ValueOrZero())
	input := model.CreateSystemIntakeContactInput{
		Component:      component,
		Role:           role,
		EuaUserID:      euaUserID,
		SystemIntakeID: intake.ID,
	}
	_, err := resolvers.CreateSystemIntakeContact(ctx, store, input)
	if err != nil {
		panic(err)
	}
}

func updateSystemIntakeContact(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	component string,
	role string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intake.EUAUserID.ValueOrZero())
	input := model.UpdateSystemIntakeContactInput{
		Component: component,
		Role:      role,
		EuaUserID: euaUserID,
	}
	_, err := resolvers.UpdateSystemIntakeContact(ctx, store, input)
	if err != nil {
		panic(err)
	}
}

func setSystemIntakeRelationNewSystem(
	logger *zap.Logger,
	store *storage.Store,
	intakeID uuid.UUID,
	contractNumbers []string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intakeID.String())
	input := &model.SetSystemIntakeRelationNewSystemInput{
		SystemIntakeID:  intakeID,
		ContractNumbers: contractNumbers,
	}

	// temp, manually set these contract numbers
	// see Note [EASI-4160 Disable Contract Number Linking]
	if err := sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.SetSystemIntakeContractNumbers(ctx, tx, intakeID, contractNumbers)
	}); err != nil {
		panic(err)
	}

	if _, err := resolvers.SetSystemIntakeRelationNewSystem(ctx, store, input); err != nil {
		panic(err)
	}
}

func setSystemIntakeRelationExistingSystem(
	logger *zap.Logger,
	store *storage.Store,
	intakeID uuid.UUID,
	contractNumbers []string,
	cedarSystemIDs []string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intakeID.String())
	input := &model.SetSystemIntakeRelationExistingSystemInput{
		SystemIntakeID:  intakeID,
		ContractNumbers: contractNumbers,
		CedarSystemIDs:  cedarSystemIDs,
	}

	// temp, manually set these contract numbers
	// see Note [EASI-4160 Disable Contract Number Linking]
	if err := sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.SetSystemIntakeContractNumbers(ctx, tx, intakeID, contractNumbers)
	}); err != nil {
		panic(err)
	}

	_, err := resolvers.SetSystemIntakeRelationExistingSystem(
		ctx,
		store,
		func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
			return &models.CedarSystem{}, nil
		},
		input,
	)
	if err != nil {
		panic(err)
	}
}

func setSystemIntakeRelationExistingService(
	logger *zap.Logger,
	store *storage.Store,
	intakeID uuid.UUID,
	contractName string,
	contractNumbers []string,
) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intakeID.String())
	input := &model.SetSystemIntakeRelationExistingServiceInput{
		SystemIntakeID:  intakeID,
		ContractName:    contractName,
		ContractNumbers: contractNumbers,
	}

	// temp, manually set these contract numbers
	// see Note [EASI-4160 Disable Contract Number Linking]
	if err := sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.SetSystemIntakeContractNumbers(ctx, tx, intakeID, contractNumbers)
	}); err != nil {
		panic(err)
	}

	_, err := resolvers.SetSystemIntakeRelationExistingService(ctx, store, input)
	if err != nil {
		panic(err)
	}
}

func unlinkSystemIntakeRelation(logger *zap.Logger, store *storage.Store, intakeID uuid.UUID) {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intakeID.String())

	// temp, manually unlink contractn umbers
	// see Note [EASI-4160 Disable Contract Number Linking]
	if err := sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.SetSystemIntakeContractNumbers(ctx, tx, intakeID, []string{})
	}); err != nil {
		panic(err)
	}

	if _, err := resolvers.UnlinkSystemIntakeRelation(ctx, store, intakeID); err != nil {
		panic(err)
	}
}

func updateSystemIntakeContactDetails(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	requesterName string,
	requesterComponent string,
	businessOwnerName string,
	businessOwnerComponent string,
	productManagerName string,
	productManagerComponent string,
	issoIsPresent bool,
	issoName string,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intake.EUAUserID.ValueOrZero())
	govTeamsPresent := true

	input := model.UpdateSystemIntakeContactDetailsInput{
		ID: intake.ID,
		Requester: &model.SystemIntakeRequesterWithComponentInput{
			Name:      requesterName,
			Component: requesterComponent,
		},
		BusinessOwner: &model.SystemIntakeBusinessOwnerInput{
			Name:      businessOwnerName,
			Component: businessOwnerComponent,
		},
		ProductManager: &model.SystemIntakeProductManagerInput{
			Name:      productManagerName,
			Component: productManagerComponent,
		},
		Isso: &model.SystemIntakeISSOInput{
			IsPresent: &issoIsPresent,
			Name:      &issoName,
		},
		GovernanceTeams: &model.SystemIntakeGovernanceTeamInput{
			IsPresent: &govTeamsPresent,
			Teams: []*model.SystemIntakeCollaboratorInput{
				{
					Collaborator: "Mrs TRB member",
					Key:          "technicalReviewBoard",
				},
				{
					Collaborator: "Ms security team member",
					Key:          "securityPrivacy",
				},
				{
					Collaborator: "Mr Enterprise Architecture",
					Key:          "enterpriseArchitecture",
				},
			},
		},
	}
	payload, err := resolvers.SystemIntakeUpdateContactDetails(ctx, store, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

func updateSystemIntakeContractDetails(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intake.EUAUserID.ValueOrZero())
	existingFunding := true
	fundingNumber1 := "123456"
	fundingNumber2 := "789012"
	source1 := "ACA 3021"
	source2 := "Fed Admin"
	source3 := "MIP Base"
	currentAnnualSpending := "It's kind of a lot"
	currentAnnualSpendingITPortion := "75%"
	plannedYearOneSpending := "A little bit more"
	plannedYearOneSpendingITPortion := "25%"
	contractor := "Dr Doom"
	startDate := time.Now().AddDate(-1, 0, 0)
	hasContract := "HAVE_CONTRACT"
	endDate := time.Now().AddDate(3, 0, 0)
	contractNumbers := []string{"123456789"}
	input := model.UpdateSystemIntakeContractDetailsInput{
		ID: intake.ID,
		FundingSources: &model.SystemIntakeFundingSourcesInput{
			ExistingFunding: &existingFunding,
			FundingSources: []*model.SystemIntakeFundingSourceInput{
				{
					FundingNumber: &fundingNumber1,
					Source:        &source1,
				},
				{
					FundingNumber: &fundingNumber2,
					Source:        &source2,
				},
				{
					FundingNumber: &fundingNumber2,
					Source:        &source3,
				},
			},
		},
		Costs: &model.SystemIntakeCostsInput{}, //doesn't appear in current form
		AnnualSpending: &model.SystemIntakeAnnualSpendingInput{
			CurrentAnnualSpending:           &currentAnnualSpending,
			CurrentAnnualSpendingITPortion:  &currentAnnualSpendingITPortion,
			PlannedYearOneSpending:          &plannedYearOneSpending,
			PlannedYearOneSpendingITPortion: &plannedYearOneSpendingITPortion,
		},
		Contract: &model.SystemIntakeContractInput{
			Contractor:  &contractor,
			StartDate:   &startDate,
			HasContract: &hasContract,
			EndDate:     &endDate,
			Numbers:     contractNumbers,
		},
	}
	payload, err := resolvers.SystemIntakeUpdateContractDetails(ctx, store, input)
	if err != nil {
		panic(err)
	}
	return payload.SystemIntake
}

func createSystemIntakeNote(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	noteContent string,
) *models.SystemIntakeNote {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)
	content := models.HTML(noteContent)
	input := model.CreateSystemIntakeNoteInput{
		Content:    content,
		AuthorName: "Author Name",
		IntakeID:   intake.ID,
	}
	note, err := resolvers.CreateSystemIntakeNote(ctx, store, input)
	if err != nil {
		panic(err)
	}
	return note
}

// Updates the System Intake through the store method directly instead of using the resolver
func modifySystemIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	cb func(*models.SystemIntake),
) *models.SystemIntake {
	if intake == nil {
		panic("must provide intake to edit")
	}
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, intake.EUAUserID.ValueOrZero())
	cb(intake)
	intake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		panic(err)
	}
	return intake
}
