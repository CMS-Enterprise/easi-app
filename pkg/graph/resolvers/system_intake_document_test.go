package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/easiencoding"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestSystemIntakeDocumentResolvers() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store
	s3Client := suite.testConfigs.S3Client

	// Create a system intake
	intake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeMAJORCHANGES,
	})
	suite.NoError(err)
	suite.NotNil(intake)

	// Check that there are no docs by default
	docs, err := GetSystemIntakeDocumentsByRequestID(ctx, store, s3Client, intake.ID)
	suite.NoError(err)
	suite.Len(docs, 0)

	// Create a document
	documentToCreate := &models.SystemIntakeDocument{
		SystemIntakeRequestID: intake.ID,
		CommonDocumentType:    models.SystemIntakeDocumentCommonTypeDraftICGE,
		FileName:              "create_and_get.pdf",
		Bucket:                "bukkit",
		S3Key:                 uuid.NewString(),
	}
	// documentToCreate.CreatedBy will be set based on principal in test config

	createdDocument := createSystemIntakeDocumentSubtest(suite, intake.ID, documentToCreate)
	getSystemIntakeDocumentsByRequestIDSubtest(suite, intake.ID, createdDocument)
	deleteSystemIntakeDocumentSubtest(suite, createdDocument)
}

// subtests are regular functions, not suite methods, so we can guarantee they run sequentially
func createSystemIntakeDocumentSubtest(suite *ResolverSuite, systemIntakeID uuid.UUID, documentToCreate *models.SystemIntakeDocument) *models.SystemIntakeDocument {
	testContents := "Test file content"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := model.CreateSystemIntakeDocumentInput{
		RequestID:            documentToCreate.SystemIntakeRequestID,
		DocumentType:         documentToCreate.CommonDocumentType,
		OtherTypeDescription: &documentToCreate.OtherType,
		FileData: graphql.Upload{
			File:        fileToUpload,
			Filename:    documentToCreate.FileName,
			Size:        fileToUpload.Size(),
			ContentType: "application/pdf",
		},
	}

	createdDocument, err := CreateSystemIntakeDocument(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		gqlInput,
	)
	suite.NoError(err)
	suite.NotNil(createdDocument)

	checkSystemIntakeDocumentEquality(suite, documentToCreate, suite.testConfigs.Principal.ID(), systemIntakeID, createdDocument)
	suite.EqualValues(suite.testConfigs.S3Client.GetBucket(), createdDocument.Bucket)

	return createdDocument // used by other tests
}

func getSystemIntakeDocumentsByRequestIDSubtest(suite *ResolverSuite, systemIntakeID uuid.UUID, createdDocument *models.SystemIntakeDocument) {
	documents, err := GetSystemIntakeDocumentsByRequestID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		systemIntakeID,
	)
	suite.NoError(err)
	suite.Equal(1, len(documents))

	fetchedDocument := documents[0]
	suite.NotNil(fetchedDocument)

	checkSystemIntakeDocumentEquality(suite, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeRequestID, fetchedDocument)
	// TODO - try downloading fetchedDocument.URL? compare content to fileToUpload from create subtest?
}

func deleteSystemIntakeDocumentSubtest(suite *ResolverSuite, createdDocument *models.SystemIntakeDocument) {
	deletedDocument, err := DeleteSystemIntakeDocument(suite.testConfigs.Context, suite.testConfigs.Store, createdDocument.ID)
	suite.NoError(err)
	checkSystemIntakeDocumentEquality(suite, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeRequestID, deletedDocument)

	remainingDocuments, err := GetSystemIntakeDocumentsByRequestID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		createdDocument.SystemIntakeRequestID,
	)
	suite.NoError(err)
	suite.Equal(0, len(remainingDocuments))
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
