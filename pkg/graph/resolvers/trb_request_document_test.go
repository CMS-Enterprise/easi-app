package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestTRBRequestDocumentResolvers() {
	// general setup
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTFormalReview, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trbRequest)
	trbRequestID := trbRequest.ID

	documentToCreate := &models.TRBRequestDocument{
		TRBRequestID:       trbRequestID,
		CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
		FileName:           "create_and_get.pdf",
		Bucket:             "bukkit",
		S3Key:              uuid.NewString(),
	}
	// docToBeCreated.CreatedBy will be set based on principal in test config

	createdDocument := createTRBRequestDocumentSubtest(s, trbRequestID, documentToCreate)
	getTRBRequestDocumentsByRequestIDSubtest(s, trbRequestID, createdDocument)
	deleteTRBRequestDocumentSubtest(s, createdDocument)
}

// subtests are regular functions, not suite methods, so we can guarantee they run sequentially

func createTRBRequestDocumentSubtest(suite *ResolverSuite, trbRequestID uuid.UUID, documentToCreate *models.TRBRequestDocument) *models.TRBRequestDocument {
	testContents := "Test file content"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := models.CreateTRBRequestDocumentInput{
		RequestID:            documentToCreate.TRBRequestID,
		DocumentType:         documentToCreate.CommonDocumentType,
		OtherTypeDescription: &documentToCreate.OtherType,
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
	suite.EqualValues(suite.testConfigs.S3Client.GetBucket(), createdDocument.Bucket)

	return createdDocument // used by other tests
}

func getTRBRequestDocumentsByRequestIDSubtest(suite *ResolverSuite, trbRequestID uuid.UUID, createdDocument *models.TRBRequestDocument) {
	documents, err := GetTRBRequestDocumentsByRequestID(
		suite.ctxWithNewDataloaders(),
		trbRequestID,
	)
	suite.NoError(err)
	suite.Equal(1, len(documents))

	fetchedDocument := documents[0]
	suite.NotNil(fetchedDocument)

	checkDocumentEquality(suite, createdDocument, createdDocument.CreatedBy, createdDocument.TRBRequestID, fetchedDocument)
	// TODO - try downloading fetchedDocument.URL? compare content to fileToUpload from create subtest?
}

func deleteTRBRequestDocumentSubtest(suite *ResolverSuite, createdDocument *models.TRBRequestDocument) {
	deletedDocument, err := DeleteTRBRequestDocument(suite.testConfigs.Context, suite.testConfigs.Store, createdDocument.ID)
	suite.NoError(err)
	checkDocumentEquality(suite, createdDocument, createdDocument.CreatedBy, createdDocument.TRBRequestID, deletedDocument)

	remainingDocuments, err := GetTRBRequestDocumentsByRequestID(
		suite.ctxWithNewDataloaders(),
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
