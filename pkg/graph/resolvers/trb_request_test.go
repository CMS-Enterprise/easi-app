package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

//TRBRequestCreate makes a new TRB request
func (suite *ResolverSuite) TestTRBRequestCreate() {

	//TODO get the context in the test configs
	trb, err := TRBRequestCreate(context.Background(), models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

}

//TRBRequestUpdate updates a TRB request
func (suite *ResolverSuite) TestTRBRequestUpdate() {

}

//TRBRequestGetByID returns a TRB request by it's ID
func (suite *ResolverSuite) TestTRBRequestGetByID() {

}

//TRBRequestCollectionGet returns all TRB Requests
func (suite *ResolverSuite) TestTRBRequestCollectionGet() {

}
