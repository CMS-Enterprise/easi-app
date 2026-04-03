package resolvers

import (
	"bytes"
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakeDocumentResolvers() {
	// Create a system intake
	intake := s.createNewIntakeWithResolver(func(si *models.SystemIntake) {
		si.RequestType = models.SystemIntakeRequestTypeMAJORCHANGES
	})
	s.NotNil(intake)

	// Check that there are no docs by default
	docs, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.Len(docs, 0)

	// Create a document
	documentToCreate := &models.SystemIntakeDocument{
		SystemIntakeID:     intake.ID,
		CommonDocumentType: models.SystemIntakeDocumentCommonTypeDraftIGCE,
		Version:            models.SystemIntakeDocumentVersionHISTORICAL,
		FileName:           "create_and_get.pdf",
		Bucket:             "bukkit",
		S3Key:              uuid.NewString(),
		UploaderRole:       models.RequesterUploaderRole,
	}

	createdDocument := createSystemIntakeDocumentSubtest(s, intake.ID, documentToCreate)
	getSystemIntakeDocumentsByRequestIDSubtest(s, intake.ID, createdDocument)
	deleteSystemIntakeDocumentSubtest(s, createdDocument)
}

func (s *ResolverSuite) TestShouldSend() {
	// only admins can send, and only if admin selected "Yes" for sending notification
	s.True(shouldSend(models.AdminUploaderRole, helpers.PointerTo(true)))

	// admin has selected "No"
	s.False(shouldSend(models.AdminUploaderRole, helpers.PointerTo(false)))

	// admin did not make a selection (currently not a possible path via UI, but just in case that changes)
	s.False(shouldSend(models.AdminUploaderRole, nil))

	// a requester has selected to send (currently not a possible path via UI - only admins can make this choice)
	s.False(shouldSend(models.RequesterUploaderRole, helpers.PointerTo(true)))

	// a requester has selected not to send (currently not a possible path via UI, but will still result in no-send)
	s.False(shouldSend(models.RequesterUploaderRole, helpers.PointerTo(false)))

	// normal path for a requester, no selection would be made (only allowed path via UI)
	s.False(shouldSend(models.RequesterUploaderRole, nil))
}

// subtests are regular functions, not suite methods, so we can guarantee they run sequentially
func createSystemIntakeDocumentSubtest(s *ResolverSuite, systemIntakeID uuid.UUID, documentToCreate *models.SystemIntakeDocument) *models.SystemIntakeDocument {
	testContents := "Test file content"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := models.CreateSystemIntakeDocumentInput{
		RequestID:            documentToCreate.SystemIntakeID,
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

	createdDocument, err := CreateSystemIntakeDocument(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.S3Client,
		s.testConfigs.EmailClient,
		gqlInput,
	)
	s.NoError(err)
	s.NotNil(createdDocument)

	checkSystemIntakeDocumentEquality(s, documentToCreate, s.testConfigs.Principal.ID(), systemIntakeID, createdDocument)
	s.EqualValues(s.testConfigs.S3Client.GetBucket(), createdDocument.Bucket)

	return createdDocument // used by other tests
}

func getSystemIntakeDocumentsByRequestIDSubtest(s *ResolverSuite, systemIntakeID uuid.UUID, createdDocument *models.SystemIntakeDocument) {
	documents, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), systemIntakeID)
	s.NoError(err)
	s.Equal(1, len(documents))

	fetchedDocument := documents[0]
	s.NotNil(fetchedDocument)

	checkSystemIntakeDocumentEquality(s, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeID, fetchedDocument)
	// TODO - try downloading fetchedDocument.URL? compare content to fileToUpload from create subtest?
}

func (s *ResolverSuite) setupContext(principalID uuid.UUID, isAdmin bool, contacts []*models.SystemIntakeContact) context.Context {
	ctx := context.Background()
	principal := &authentication.EUAPrincipal{
		EUAID:      "TEST",
		JobCodeGRT: isAdmin,
		UserAccount: &authentication.UserAccount{
			ID:       principalID,
			Username: "TEST",
		},
	}
	ctx = appcontext.WithPrincipal(ctx, principal)

	buildDataloaders := func() *dataloaders.Dataloaders {
		dl := dataloaders.NewDataloaders(
			nil,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
		// Mock the SystemIntakeContactsBySystemIntakeID dataloader
		dl.SystemIntakeContactsBySystemIntakeID = dataloadgen.NewLoader(func(ctx context.Context, ids []uuid.UUID) ([][]*models.SystemIntakeContact, []error) {
			results := make([][]*models.SystemIntakeContact, len(ids))
			for i := range ids {
				results[i] = contacts
			}
			return results, nil
		})
		return dl
	}
	ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)
	return ctx
}

func (s *ResolverSuite) TestGetUploaderRole() {
	intakeID := uuid.New()
	userID := uuid.New()

	intake := &models.SystemIntake{
		ID: intakeID,
	}

	s.Run("User is requester", func() {
		contact := models.NewSystemIntakeContact(userID, uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.NoError(err)
		s.Equal(models.RequesterUploaderRole, role)
	})

	s.Run("User is not requester but is admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, true, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.NoError(err)
		s.Equal(models.AdminUploaderRole, role)
	})

	s.Run("User is neither requester nor admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get uploader role")
	})

	s.Run("Requester not found", func() {
		contacts := []*models.SystemIntakeContact{}
		ctx := s.setupContext(userID, true, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get requester for uploader role")
	})
}

func (s *ResolverSuite) TestAllowCreate() {
	intakeID := uuid.New()
	userID := uuid.New()

	intake := &models.SystemIntake{
		ID: intakeID,
	}

	s.Run("User is requester", func() {
		contact := models.NewSystemIntakeContact(userID, uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := allowCreate(ctx, intake)
		s.NoError(err)
		s.Equal(models.RequesterUploaderRole, role)
	})

	s.Run("User is not requester but is admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, true, contacts)

		role, err := allowCreate(ctx, intake)
		s.NoError(err)
		s.Equal(models.AdminUploaderRole, role)
	})

	s.Run("User is neither requester nor admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := allowCreate(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get uploader role")
	})

	s.Run("Requester not found", func() {
		contacts := []*models.SystemIntakeContact{}
		ctx := s.setupContext(userID, true, contacts)

		role, err := allowCreate(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get requester for uploader role")
	})
}

func deleteSystemIntakeDocumentSubtest(s *ResolverSuite, createdDocument *models.SystemIntakeDocument) {
	deletedDocument, err := DeleteSystemIntakeDocument(s.testConfigs.Context, s.testConfigs.Store, createdDocument.ID)
	s.NoError(err)
	checkSystemIntakeDocumentEquality(s, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeID, deletedDocument)

	remainingDocuments, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), createdDocument.SystemIntakeID)
	s.NoError(err)
	s.Equal(0, len(remainingDocuments))
}

func checkSystemIntakeDocumentEquality(
	suite *ResolverSuite,
	expectedDocument *models.SystemIntakeDocument,
	expectedCreatedBy string,
	expectedSystemIntakeID uuid.UUID,
	actualDocument *models.SystemIntakeDocument,
) {
	// baseStruct fields
	suite.NotNil(actualDocument.ID)
	suite.EqualValues(expectedCreatedBy, actualDocument.CreatedBy)
	suite.NotNil(actualDocument.CreatedAt)
	suite.Nil(actualDocument.ModifiedBy)
	suite.Nil(actualDocument.ModifiedAt)

	// SystemIntakeDocument-specific fields
	suite.EqualValues(expectedSystemIntakeID, actualDocument.SystemIntakeID)
	suite.EqualValues(expectedDocument.CommonDocumentType, actualDocument.CommonDocumentType)
	suite.EqualValues(expectedDocument.OtherType, actualDocument.OtherType)
	suite.EqualValues(expectedDocument.FileName, actualDocument.FileName)
}
