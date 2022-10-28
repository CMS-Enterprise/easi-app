package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestTRBRequestDocumentResolvers() {
	// general setup
	trbRequest, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTFormalReview, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trbRequest)
	trbRequestID := trbRequest.ID

	documentToCreate := &models.TRBRequestDocument{
		TRBRequestID:       trbRequestID,
		CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
		FileName:           "create_and_get.pdf",
		URL:                "http://www.example.com",
		Bucket:             "bukkit",
		S3Key:              uuid.NewString(),
	}
	// docToBeCreated.CreatedBy will be set based on principal in test config

	createdDocument := createTRBRequestDocumentSubtest(suite, trbRequestID, documentToCreate)
	getTRBRequestDocumentsByRequestIDSubtest(suite, trbRequestID, createdDocument)
	deleteTRBRequestDocumentSubtest(suite, createdDocument)
}

// subtests are regular functions, not suite methods, so we can guarantee they run sequentially

func createTRBRequestDocumentSubtest(suite *ResolverSuite, trbRequestID uuid.UUID, documentToCreate *models.TRBRequestDocument) *models.TRBRequestDocument {
	fileToUpload := bytes.NewReader([]byte("Test file content"))
	gqlInput := model.CreateTRBRequestDocumentInput{
		RequestID:            documentToCreate.TRBRequestID,
		DocumentType:         documentToCreate.CommonDocumentType,
		OtherTypeDescription: &documentToCreate.OtherType,
		FileName:             documentToCreate.FileName,
		FileData: graphql.Upload{
			File:        fileToUpload,
			Filename:    documentToCreate.FileName,
			Size:        fileToUpload.Size(),
			ContentType: "application/pdf",
		},
	}

	createdDocument, err := CreateTRBRequestDocument(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		gqlInput,
	)
	suite.NoError(err)
	suite.NotNil(createdDocument)

	checkDocumentEquality(suite, documentToCreate, suite.testConfigs.Principal.ID(), trbRequestID, createdDocument)

	// TODO - status?
	// TODO - URL/Bucket/FileKey (come from S3)

	// TODO - test that it was uploaded to S3? use a mock for S3Client?

	return createdDocument // used by other tests
}

func getTRBRequestDocumentsByRequestIDSubtest(suite *ResolverSuite, trbRequestID uuid.UUID, createdDocument *models.TRBRequestDocument) {
	documents, err := GetTRBRequestDocumentsByRequestID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		trbRequestID,
	)
	suite.NoError(err)
	suite.Equal(1, len(documents))

	fetchedDocument := documents[0]
	suite.NotNil(fetchedDocument)

	checkDocumentEquality(suite, createdDocument, createdDocument.CreatedBy, createdDocument.TRBRequestID, fetchedDocument)

	// TODO - test S3 URL validity?
}

func deleteTRBRequestDocumentSubtest(suite *ResolverSuite, createdDocument *models.TRBRequestDocument) {
	deletedDocument, err := DeleteTRBRequestDocument(suite.testConfigs.Context, suite.testConfigs.Store, createdDocument.ID)
	suite.NoError(err)
	checkDocumentEquality(suite, createdDocument, createdDocument.CreatedBy, createdDocument.TRBRequestID, deletedDocument)

	remainingDocuments, err := GetTRBRequestDocumentsByRequestID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		createdDocument.TRBRequestID,
	)
	suite.NoError(err)
	suite.Equal(0, len(remainingDocuments))
}

func checkDocumentEquality(
	suite *ResolverSuite,
	expectedDocument *models.TRBRequestDocument,
	expectedCreatedBy string,
	expectedTRBRequestID uuid.UUID,
	actualDocument *models.TRBRequestDocument,
) {
	// baseStruct fields
	suite.NotNil(actualDocument.ID)
	suite.EqualValues(expectedCreatedBy, actualDocument.CreatedBy)
	suite.NotNil(actualDocument.CreatedAt)
	suite.Nil(actualDocument.ModifiedBy)
	suite.Nil(actualDocument.ModifiedAt)

	// TRBRequestDocument-specific fields
	suite.EqualValues(expectedTRBRequestID, actualDocument.TRBRequestID)
	suite.EqualValues(expectedDocument.CommonDocumentType, actualDocument.CommonDocumentType)
	suite.EqualValues(expectedDocument.OtherType, actualDocument.OtherType)
	suite.EqualValues(expectedDocument.FileName, actualDocument.FileName)
}
