package resolvers

import (
	"github.com/cmsgov/easi-app/pkg/models"
)

// TRBRequestCreate makes a new TRB request
func (suite *ResolverSuite) TestTRBRequestCreate() {

	//TODO get the context in the test configs
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	suite.EqualValues(trb.Archived, false)
	suite.EqualValues(trb.Name, "Draft")
	suite.EqualValues(trb.Status, models.TRBSOpen)
	suite.EqualValues(trb.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.NotNil(trb.ID)
	suite.NotNil(trb.CreatedAt)
	suite.Nil(trb.ModifiedBy)
	suite.Nil(trb.ModifiedAt)

}

// TRBRequestUpdate updates a TRB request
func (suite *ResolverSuite) TestTRBRequestUpdate() {

	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	changes := map[string]interface{}{
		"Name":     "Testing",
		"status":   models.TRBSClosed,
		"archived": false,
	}
	princ := suite.testConfigs.Principal.ID()

	updated, err := UpdateTRBRequest(suite.testConfigs.Context, trb.ID, changes, suite.testConfigs.Store)
	suite.NotNil(updated)
	suite.NoError(err)
	suite.EqualValues(updated.Name, "Testing")
	suite.EqualValues(updated.Status, models.TRBSClosed)
	suite.EqualValues(updated.Archived, false)
	suite.EqualValues(updated.ModifiedBy, &princ)
	suite.NotNil(updated.ModifiedAt)

}

// TRBRequestGetByID returns a TRB request by it's ID
func (suite *ResolverSuite) TestTRBRequestGetByID() {
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	ret, err := GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(ret)

}

// TRBRequestCollectionGet returns all TRB Requests
func (suite *ResolverSuite) TestTRBRequestCollectionGet() {

	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)
	//Check we return 1 value
	col, err := GetTRBRequests(suite.testConfigs.Context, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trb, col[0])

	trb2, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb2)
	//Check for 2 request
	col, err = GetTRBRequests(suite.testConfigs.Context, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 2)

	changes := map[string]interface{}{
		"status":   models.TRBSClosed,
		"archived": true,
	}

	//archive
	trbUpdate, err := UpdateTRBRequest(suite.testConfigs.Context, trb2.ID, changes, suite.testConfigs.Store)
	suite.NoError(err)

	//GET archived collection
	col, err = GetTRBRequests(suite.testConfigs.Context, true, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trbUpdate, col[0])

}
