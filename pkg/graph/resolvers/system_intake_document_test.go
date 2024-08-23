package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakeDocumentResolvers() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	// Create a system intake
	intake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeMAJORCHANGES,
	})
	s.NoError(err)
	s.NotNil(intake)

	// Check that there are no docs by default
	docs, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.Len(docs, 0)

	// Create a document
	documentToCreate := &models.SystemIntakeDocument{
		SystemIntakeRequestID: intake.ID,
		CommonDocumentType:    models.SystemIntakeDocumentCommonTypeDraftIGCE,
		Version:               models.SystemIntakeDocumentVersionHISTORICAL,
		FileName:              "create_and_get.pdf",
		Bucket:                "bukkit",
		S3Key:                 uuid.NewString(),
		UploaderRole:          models.RequesterUploaderRole,
	}
	// documentToCreate.CreatedBy will be set based on principal in test config

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

	checkSystemIntakeDocumentEquality(s, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeRequestID, fetchedDocument)
	// TODO - try downloading fetchedDocument.URL? compare content to fileToUpload from create subtest?
}

func deleteSystemIntakeDocumentSubtest(s *ResolverSuite, createdDocument *models.SystemIntakeDocument) {
	deletedDocument, err := DeleteSystemIntakeDocument(s.testConfigs.Context, s.testConfigs.Store, createdDocument.ID)
	s.NoError(err)
	checkSystemIntakeDocumentEquality(s, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeRequestID, deletedDocument)

	remainingDocuments, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), createdDocument.SystemIntakeRequestID)
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
	suite.EqualValues(expectedSystemIntakeID, actualDocument.SystemIntakeRequestID)
	suite.EqualValues(expectedDocument.CommonDocumentType, actualDocument.CommonDocumentType)
	suite.EqualValues(expectedDocument.OtherType, actualDocument.OtherType)
	suite.EqualValues(expectedDocument.FileName, actualDocument.FileName)
}
