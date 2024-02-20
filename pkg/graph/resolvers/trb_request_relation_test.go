package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestSetTRBRequestRelationNewSystem() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	ctx = appcontext.WithLogger(ctx, suite.testConfigs.Logger)
	ctx = dataloaders.CTXWithLoaders(ctx, dataloaders.NewDataLoaders(suite.testConfigs.Store, func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil }))

	// Create an initial TRB Request
	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.NotEqual(trbRequest.ID, uuid.Nil)

	contractNumbers := []string{"11111", "22222"}

	updatedReq, err := SetTRBRequestRelationNewSystem(ctx, store, model.SetTRBRequestRelationNewSystemInput{
		TrbRequestID:    trbRequest.ID,
		ContractNumbers: contractNumbers,
	})

	suite.NoError(err)
	suite.Equal(models.RelationTypeNewSystem, *updatedReq.SystemRelationType)

	existingContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
	suite.NoError(err)

	var numbersOnly []string
	for _, contract := range existingContractNumbers {
		numbersOnly = append(numbersOnly, contract.ContractNumber)
	}
	suite.ElementsMatch(numbersOnly, contractNumbers)
}

func (suite *ResolverSuite) TestSetTRBRequestRelationExistingSystem() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	ctx = appcontext.WithLogger(ctx, suite.testConfigs.Logger)
	ctx = dataloaders.CTXWithLoaders(ctx, dataloaders.NewDataLoaders(suite.testConfigs.Store, func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil }))

	// Create an initial TRB Request

	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.NotEqual(trbRequest.ID, uuid.Nil)

	contractNumbers := []string{"2468", "13579"}

	// TODO: check this value for containing cedar system ids
	updatedReq, err := SetTRBRequestRelationExistingSystem(ctx, store, model.SetTRBRequestRelationExistingSystemInput{
		TrbRequestID:    trbRequest.ID,
		CedarSystemIDs:  []string{"hello", "cedar!"},
		ContractNumbers: contractNumbers,
	})
	suite.NoError(err)
	suite.Equal(models.RelationTypeExistingSystem, *updatedReq.SystemRelationType)

	existingContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
	suite.NoError(err)

	var numbersOnly []string
	for _, contract := range existingContractNumbers {
		numbersOnly = append(numbersOnly, contract.ContractNumber)
	}
	suite.ElementsMatch(numbersOnly, contractNumbers)
}

func (suite *ResolverSuite) TestSetTRBRequestRelationExistingService() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	ctx = appcontext.WithLogger(ctx, suite.testConfigs.Logger)
	ctx = dataloaders.CTXWithLoaders(ctx, dataloaders.NewDataLoaders(suite.testConfigs.Store, func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil }))

	// Create an initial TRB Request
	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.NotEqual(trbRequest.ID, uuid.Nil)

	contractNumbers := []string{"555555", "444444"}

	withExistingService, err := SetTRBRequestRelationExistingService(ctx, store, model.SetTRBRequestRelationExistingServiceInput{
		TrbRequestID:    trbRequest.ID,
		ContractName:    "existing service",
		ContractNumbers: contractNumbers,
	})
	suite.NoError(err)
	strVal, _ := withExistingService.ContractName.Value()
	suite.NotNil(strVal)
	suite.Equal(strVal, "existing service")
	suite.Equal(models.RelationTypeExistingService, *withExistingService.SystemRelationType)

	existingContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
	suite.NoError(err)

	var numbersOnly []string
	for _, contract := range existingContractNumbers {
		numbersOnly = append(numbersOnly, contract.ContractNumber)
	}
	suite.ElementsMatch(numbersOnly, contractNumbers)
}

func (suite *ResolverSuite) TestUnlinkTRBRequestRelation() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	ctx = appcontext.WithLogger(ctx, suite.testConfigs.Logger)
	ctx = dataloaders.CTXWithLoaders(ctx, dataloaders.NewDataLoaders(suite.testConfigs.Store, func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil }))

	// Create an initial TRB Request
	trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
	suite.NoError(err)
	suite.NotEqual(trbRequest.ID, uuid.Nil)

	trbRequest.ContractName = zero.NewString("unlink test", true)

	updated, err := store.UpdateTRBRequest(ctx, trbRequest)
	suite.NoError(err)

	strVal, _ := updated.ContractName.Value()
	suite.NotNil(strVal)
	suite.Equal(strVal, "unlink test")

	contractNumbers := []string{"1001011", "001101"}

	// set this to have a relation
	_, err = SetTRBRequestRelationNewSystem(ctx, store, model.SetTRBRequestRelationNewSystemInput{
		TrbRequestID:    trbRequest.ID,
		ContractNumbers: contractNumbers,
	})
	suite.NoError(err)

	// try to unlink
	unlinked, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
	suite.NoError(err)

	strVal, _ = unlinked.ContractName.Value()
	suite.Nil(strVal)

	suite.Nil(unlinked.SystemRelationType)

	// confirm contract numbers are removed
	existingContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
	suite.NoError(err)
	suite.Empty(existingContractNumbers)
}
