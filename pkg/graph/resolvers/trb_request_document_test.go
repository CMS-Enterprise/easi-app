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

	documentToCreate := models.TRBRequestDocument{
		TRBRequestID:       trbRequestID,
		CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
		FileName:           "create_and_get.pdf",
		URL:                "http://www.example.com",
		Bucket:             "bukkit",
		S3Key:              uuid.NewString(),
	}
	// docToBeCreated.CreatedBy will be set based on principal in test config

	createdDocumentID := createTRBRequestDocumentSubtest(suite, trbRequestID, documentToCreate)
	getTRBRequestDocumentsByRequestIDSubtest(suite, trbRequestID, documentToCreate, createdDocumentID)
}

// subtests are regular functions, not suite methods, so we can guarantee they run sequentially

func createTRBRequestDocumentSubtest(suite *ResolverSuite, trbRequestID uuid.UUID, documentToCreate models.TRBRequestDocument) uuid.UUID {
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

	// baseStruct fields
	suite.NotNil(createdDocument.ID)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, createdDocument.CreatedBy)
	suite.NotNil(createdDocument.CreatedAt)
	suite.Nil(createdDocument.ModifiedBy)
	suite.Nil(createdDocument.ModifiedAt)

	// TRBRequestDocument-specific fields
	suite.EqualValues(trbRequestID, createdDocument.TRBRequestID)
	suite.EqualValues(documentToCreate.CommonDocumentType, createdDocument.CommonDocumentType)
	suite.EqualValues(documentToCreate.OtherType, createdDocument.OtherType)
	suite.EqualValues(documentToCreate.FileName, createdDocument.FileName)
	// TODO - status?
	// TODO - URL/Bucket/FileKey (come from S3)

	// TODO - test that it was uploaded to S3? use a mock for S3Client?

	return createdDocument.ID // used by other tests
}

func getTRBRequestDocumentsByRequestIDSubtest(suite *ResolverSuite, trbRequestID uuid.UUID, createdDocument models.TRBRequestDocument, createdDocumentID uuid.UUID) {
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

	// baseStruct fields
	suite.NotNil(fetchedDocument.ID)
	suite.Equal(createdDocumentID, fetchedDocument.ID)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, fetchedDocument.CreatedBy)
	suite.NotNil(fetchedDocument.CreatedAt)
	suite.Nil(fetchedDocument.ModifiedBy)
	suite.Nil(fetchedDocument.ModifiedAt)

	// TRBRequestDocument-specific fields
	suite.EqualValues(trbRequestID, fetchedDocument.TRBRequestID)
	suite.EqualValues(createdDocument.CommonDocumentType, fetchedDocument.CommonDocumentType)
	suite.EqualValues(createdDocument.OtherType, fetchedDocument.OtherType)
	suite.EqualValues(createdDocument.FileName, fetchedDocument.FileName)

	// TODO - test S3 URL validity?
}
