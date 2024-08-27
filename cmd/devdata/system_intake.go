package main

import (
	"bytes"
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
	"github.com/cms-enterprise/easi-app/pkg/upload"
)

// creates, fills out the initial request form, and submits a system intake
func makeSystemIntakeAndSubmit(
	ctx context.Context,
	requestName string,
	intakeID *uuid.UUID,
	requesterEUAID string,
	store *storage.Store,
) *models.SystemIntake {
	intake := makeSystemIntake(ctx, requestName, intakeID, requesterEUAID, store)
	return submitSystemIntake(ctx, store, intake)
}

// creates an intake and fills out the initial request form
func makeSystemIntake(
	ctx context.Context,
	requestName string,
	intakeID *uuid.UUID,
	requesterEUAID string,
	store *storage.Store,
) *models.SystemIntake {
	intake := createSystemIntake(
		ctx,
		intakeID,
		store,
		requesterEUAID,
		"Requester Name",
		models.SystemIntakeRequestTypeNEW,
	)
	createSystemIntakeDocument(ctx, store, intake)
	return fillOutInitialIntake(ctx, requestName, store, intake)
}

// updates an intake and fills out the initial request form
func fillOutInitialIntake(
	ctx context.Context,
	requestName string,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	intake = updateSystemIntakeRequestDetails(ctx, store, intake,
		requestName,
		"An intense business need",
		"with a great business solution",
		true,
		"Some CEDAR System ID",
		"the current stage",
		true,
	)
	updateSystemIntakeContact(ctx, store,
		"USR1",
		"Center for Medicare",
		"Requester",
	)
	createSystemIntakeContact(ctx, store, intake,
		"A11Y",
		"Center for Medicare",
		"Business Owner",
	)
	createSystemIntakeContact(ctx, store, intake,
		"OQYV",
		"Center for Medicare",
		"Product Manager",
	)
	createSystemIntakeContact(ctx, store, intake,
		"GP87",
		"Center for Medicare",
		"ISSO",
	)
	intake = updateSystemIntakeContactDetails(ctx, store, intake,
		"User One",
		"Office of the Actuary",
		"Ally Anderson",
		"Office of Minority Health",
		"Hallie O'Hara",
		"Emergency Preparedness and Response Operations",
		true,
		"Leatha Gorczany",
	)
	return updateSystemIntakeContractDetails(ctx, store, intake)
}

func submitSystemIntake(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
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
	input := models.SubmitIntakeInput{
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
	ctx context.Context,
	intakeID *uuid.UUID,
	store *storage.Store,
	requesterEUAID string,
	requesterName string,
	requestType models.SystemIntakeRequestType,
) *models.SystemIntake {
	var requesterEUAIDPtr *string
	if requesterEUAID != "" {
		requesterEUAIDPtr = &requesterEUAID
	}
	// The resolver requires an EUA ID and creates a random intake ID.
	// Only use the resolver if there is no pre-made intake ID and the Requester EUA is given.
	if intakeID == nil && requesterEUAIDPtr != nil {
		input := models.CreateSystemIntakeInput{
			RequestType: requestType,
			Requester: &models.SystemIntakeRequesterInput{
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
		State:       models.SystemIntakeStateOpen,
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
	ctx context.Context,
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
	input := models.UpdateSystemIntakeRequestDetailsInput{
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
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	component string,
	role string,
) {
	input := models.CreateSystemIntakeContactInput{
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
	ctx context.Context,
	store *storage.Store,
	euaUserID string,
	component string,
	role string,
) {
	input := models.UpdateSystemIntakeContactInput{
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
	ctx context.Context,
	store *storage.Store,
	intakeID uuid.UUID,
	contractNumbers []string,
) {
	input := &models.SetSystemIntakeRelationNewSystemInput{
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
	ctx context.Context,
	store *storage.Store,
	intakeID uuid.UUID,
	contractNumbers []string,
	cedarSystemIDs []string,
) {
	input := &models.SetSystemIntakeRelationExistingSystemInput{
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
			return cedarcoremock.GetSystem(systemID), nil
		},
		input,
	)
	if err != nil {
		panic(err)
	}
}

func setSystemIntakeRelationExistingService(
	ctx context.Context,
	store *storage.Store,
	intakeID uuid.UUID,
	contractName string,
	contractNumbers []string,
) {
	input := &models.SetSystemIntakeRelationExistingServiceInput{
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

func unlinkSystemIntakeRelation(ctx context.Context, store *storage.Store, intakeID uuid.UUID) {
	// temp, manually unlink contract numbers
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
	ctx context.Context,
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
	govTeamsPresent := true

	input := models.UpdateSystemIntakeContactDetailsInput{
		ID: intake.ID,
		Requester: &models.SystemIntakeRequesterWithComponentInput{
			Name:      requesterName,
			Component: requesterComponent,
		},
		BusinessOwner: &models.SystemIntakeBusinessOwnerInput{
			Name:      businessOwnerName,
			Component: businessOwnerComponent,
		},
		ProductManager: &models.SystemIntakeProductManagerInput{
			Name:      productManagerName,
			Component: productManagerComponent,
		},
		Isso: &models.SystemIntakeISSOInput{
			IsPresent: &issoIsPresent,
			Name:      &issoName,
		},
		GovernanceTeams: &models.SystemIntakeGovernanceTeamInput{
			IsPresent: &govTeamsPresent,
			Teams: []*models.SystemIntakeCollaboratorInput{
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
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
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
	hasContract := "IN_PROGRESS"
	endDate := time.Now().AddDate(3, 0, 0)
	contractNumbers := []string{}
	input := models.UpdateSystemIntakeContractDetailsInput{
		ID: intake.ID,
		FundingSources: &models.SystemIntakeFundingSourcesInput{
			ExistingFunding: &existingFunding,
			FundingSources: []*models.SystemIntakeFundingSourceInput{
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
		Costs: &models.SystemIntakeCostsInput{}, //doesn't appear in current form
		AnnualSpending: &models.SystemIntakeAnnualSpendingInput{
			CurrentAnnualSpending:           &currentAnnualSpending,
			CurrentAnnualSpendingITPortion:  &currentAnnualSpendingITPortion,
			PlannedYearOneSpending:          &plannedYearOneSpending,
			PlannedYearOneSpendingITPortion: &plannedYearOneSpendingITPortion,
		},
		Contract: &models.SystemIntakeContractInput{
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
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	noteContent string,
) *models.SystemIntakeNote {
	content := models.HTML(noteContent)
	input := models.CreateSystemIntakeNoteInput{
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

func createSystemIntakeDocument(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntakeDocument {
	documentToCreate := &models.SystemIntakeDocument{
		SystemIntakeRequestID: intake.ID,
		CommonDocumentType:    models.SystemIntakeDocumentCommonTypeDraftIGCE,
		Version:               models.SystemIntakeDocumentVersionCURRENT,
		FileName:              "create_and_get.pdf",
	}
	documentToCreate.CreatedBy = mock.PrincipalUser
	documentToCreate.CreatedAt = time.Now()
	testContents := "Test file content"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := models.CreateSystemIntakeDocumentInput{
		RequestID:            documentToCreate.SystemIntakeRequestID,
		DocumentType:         documentToCreate.CommonDocumentType,
		Version:              documentToCreate.Version,
		OtherTypeDescription: &documentToCreate.OtherType,
		FileData: graphql.Upload{
			File:        fileToUpload,
			Filename:    documentToCreate.FileName,
			Size:        fileToUpload.Size(),
			ContentType: "application/pdf",
		},
	}

	config := testhelpers.NewConfig()
	s3Client := upload.NewS3Client(upload.Config{
		IsLocal: true,
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
	})
	createdDocument, err := resolvers.CreateSystemIntakeDocument(
		ctx,
		store,
		&s3Client,
		nil,
		gqlInput,
	)
	if err != nil {
		panic(err)
	}

	return createdDocument
}

// Updates the System Intake through the store method directly instead of using the resolver
func modifySystemIntake(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	cb func(*models.SystemIntake),
) *models.SystemIntake {
	if intake == nil {
		panic("must provide intake to edit")
	}
	cb(intake)
	intake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		panic(err)
	}
	return intake
}
