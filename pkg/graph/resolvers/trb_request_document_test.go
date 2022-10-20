package resolvers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestCreateTRBRequestDocument() {
	anonEua := "ANON"

	trbRequest := models.NewTRBRequest(anonEua)
	returnedRequest, err := suite.testConfigs.Store.CreateTRBRequest(suite.testConfigs.Logger, trbRequest)
	suite.NoError(err)
	trbRequestID := returnedRequest.ID

	docToBeCreated := models.TRBRequestDocument{
		TRBRequestID:       trbRequestID,
		CommonDocumentType: models.TRBRequestDocumentCommonTypeArchitectureDiagram,
		FileName:           "create_and_get.pdf",
		URL:                "http://www.example.com",
		Bucket:             "bukkit",
		FileKey:            uuid.NewString(),
	}
	docToBeCreated.CreatedBy = anonEua

	createdDoc, err := CreateTRBRequestDocument(suite.testConfigs.Context, suite.testConfigs.Store /*, &docToBeCreated*/)
	suite.NoError(err)
	suite.NotNil(createdDoc)

	// baseStruct fields
	suite.NotNil(createdDoc.ID)
	suite.EqualValues(anonEua, createdDoc.CreatedBy)
	suite.NotNil(createdDoc.CreatedAt)
	suite.Nil(createdDoc.ModifiedBy)
	suite.Nil(createdDoc.ModifiedAt)

	// TRBRequestDocument-specific fields
	suite.EqualValues(trbRequestID, createdDoc.TRBRequestID)
	suite.EqualValues(models.TRBRequestDocumentCommonTypeArchitectureDiagram, createdDoc.CommonDocumentType)
	suite.EqualValues("", createdDoc.OtherType)
	suite.EqualValues("create_and_get.pdf", createdDoc.FileName)
	// TODO - status?
	// TODO - URL/Bucket/FileKey (come from S3)
}
