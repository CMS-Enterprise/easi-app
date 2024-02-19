package resolvers

import (
	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestSetTRBRequestRelationNewSystem() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	// Create an initial TRB Request
	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.False(trbRequest.ID == uuid.Nil)

	// TODO: check this value for containing contract numbers
	_, err = SetTRBRequestRelationNewSystem(ctx, store, model.SetTRBRequestRelationNewSystemInput{
		TrbRequestID:    trbRequest.ID,
		ContractNumbers: []string{"11111", "22222"},
	})

	suite.NoError(err)

}

func (suite *ResolverSuite) TestSetTRBRequestRelationExistingSystem() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	// Create an initial TRB Request

	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.False(trbRequest.ID == uuid.Nil)

	// TODO: check this value for containing cedar system ids and contract numbers
	_, err = SetTRBRequestRelationExistingSystem(ctx, store, model.SetTRBRequestRelationExistingSystemInput{
		TrbRequestID:    trbRequest.ID,
		CedarSystemIDs:  []string{"hello", "cedar!"},
		ContractNumbers: []string{"2468", "13579"},
	})
	suite.NoError(err)
}

func (suite *ResolverSuite) TestSetTRBRequestRelationExistingService() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	// Create an initial TRB Request
	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.False(trbRequest.ID == uuid.Nil)

	// TODO: check this value for containing contract numbers
	withExistingService, err := SetTRBRequestRelationExistingService(ctx, store, model.SetTRBRequestRelationExistingServiceInput{
		TrbRequestID:    trbRequest.ID,
		ContractName:    "existing service",
		ContractNumbers: []string{"555555", "444444"},
	})
	suite.NoError(err)
	strVal, _ := withExistingService.ContractName.Value()
	suite.NotNil(strVal)
	suite.Equal(strVal, "existing service")
}

func (suite *ResolverSuite) TestUnlinkTRBRequestRelation() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	// Create an initial TRB Request
	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.False(trbRequest.ID == uuid.Nil)

	trbRequest.ContractName = zero.NewString("unlink test", true)

	updated, err := store.UpdateTRBRequest(ctx, trbRequest)
	suite.NoError(err)

	strVal, _ := updated.ContractName.Value()
	suite.NotNil(strVal)
	suite.Equal(strVal, "unlink test")

	// try to unlink
	unlinked, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
	suite.NoError(err)

	strVal, _ = unlinked.ContractName.Value()
	suite.Nil(strVal)

	suite.Nil(unlinked.SystemRelationType)
}
