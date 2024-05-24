package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequest makes a new TRB request
func (suite *ResolverSuite) TestCreateTRBRequest() {
	//TODO get the context in the test configs
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	suite.EqualValues(false, trb.Archived)
	suite.Nil(trb.Name)
	suite.EqualValues(models.TRBRequestStateOpen, trb.State)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, trb.CreatedBy)
	suite.NotNil(trb.ID)
	suite.NotNil(trb.CreatedAt)
	suite.Nil(trb.ModifiedBy)
	suite.Nil(trb.ModifiedAt)
}

// TestUpdateTRBRequest updates a TRB request
func (suite *ResolverSuite) TestUpdateTRBRequest() {
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	changes := map[string]interface{}{
		"Name":     "Testing",
		"state":    models.TRBRequestStateClosed,
		"archived": false,
	}
	princ := suite.testConfigs.Principal.ID()

	updated, err := UpdateTRBRequest(suite.testConfigs.Context, trb.ID, changes, suite.testConfigs.Store)
	suite.NotNil(updated)
	suite.NoError(err)
	suite.EqualValues(*updated.Name, "Testing")
	suite.EqualValues(updated.State, models.TRBRequestStateClosed)
	suite.EqualValues(updated.Archived, false)
	suite.EqualValues(updated.ModifiedBy, &princ)
	suite.NotNil(updated.ModifiedAt)
}

// TestGetTRBRequestByID returns a TRB request by it's ID
func (suite *ResolverSuite) TestGetTRBRequestByID() {
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	ret, err := GetTRBRequestByID(suite.testConfigs.Context, trb.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(ret)
}

// TestGetTRBRequests returns all TRB Requests
func (suite *ResolverSuite) TestGetTRBRequests() {
	// Create a context to use for requests from another user
	principalABCD := &authentication.EUAPrincipal{
		EUAID:           "ABCD",
		JobCodeEASi:     true,
		JobCodeGRT:      true,
		JobCodeTRBAdmin: true,
	}
	ctxABCD := appcontext.WithLogger(context.Background(), suite.testConfigs.Logger)
	ctxABCD = appcontext.WithPrincipal(ctxABCD, principalABCD)

	// Create a TRB request with TEST
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	// Check TEST sees 1 request
	col, err := GetTRBRequests(suite.testConfigs.Context, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trb, col[0])

	// Create a TRB request under ABCD
	trb2, err := CreateTRBRequest(ctxABCD, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb2)
	//Check for 2 request
	col, err = GetTRBRequests(suite.testConfigs.Context, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 2)

	changes := map[string]interface{}{
		"state":    models.TRBRequestStateClosed,
		"archived": true,
	}

	// archive
	trbUpdate, err := UpdateTRBRequest(ctxABCD, trb2.ID, changes, suite.testConfigs.Store)
	suite.NoError(err)

	// GET archived collection from ABCD's perspective
	col, err = GetTRBRequests(ctxABCD, true, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trbUpdate, col[0])
}

// TestGetMyTRBRequests returns a users TRB Requests
func (suite *ResolverSuite) TestGetMyTRBRequests() {
	// Create a context to use for requests from another user
	principalABCD := &authentication.EUAPrincipal{
		EUAID:           "ABCD",
		JobCodeEASi:     true,
		JobCodeGRT:      true,
		JobCodeTRBAdmin: true,
	}
	ctxABCD := appcontext.WithLogger(context.Background(), suite.testConfigs.Logger)
	ctxABCD = appcontext.WithPrincipal(ctxABCD, principalABCD)

	// Create a TRB request with TEST
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	// Check TEST sees 1 request
	col, err := GetMyTRBRequests(suite.testConfigs.Context, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trb, col[0])

	// Check ABCD sees 0 requests
	col, err = GetMyTRBRequests(ctxABCD, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 0)

	// Create a TRB request under ABCD
	trb2, err := CreateTRBRequest(ctxABCD, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb2)

	// TEST should see 1 request (their already created one)
	col, err = GetMyTRBRequests(suite.testConfigs.Context, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trb, col[0])

	// ABCD should see 1 request (the one we just created)
	col, err = GetMyTRBRequests(ctxABCD, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trb2, col[0])

	changes := map[string]interface{}{
		"state":    models.TRBRequestStateClosed,
		"archived": true,
	}

	// archive ABCD's request
	trbUpdate, err := UpdateTRBRequest(ctxABCD, trb2.ID, changes, suite.testConfigs.Store)
	suite.NoError(err)

	// GET collection from ABCD's perspective and expect to not see any
	col, err = GetMyTRBRequests(ctxABCD, false, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 0)

	// GET collection from ABCD's perspective (with archived true) and expect to see one
	col, err = GetMyTRBRequests(ctxABCD, true, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(col, 1)
	suite.EqualValues(trbUpdate, col[0])
}

// TestUpdateTRBRequestConsultMeetingTime tests the scheduling of consult meeting
func (suite *ResolverSuite) TestUpdateTRBRequestConsultMeetingTime() {
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	fetchUserInfo := func(ctx context.Context, eua string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    eua,
			DisplayName: "Mc Lovin",
			Email:       "mclovin@example.com",
		}, nil
	}

	fetchUserInfos := func(ctx context.Context, euas []string) ([]*models.UserInfo, error) {
		userInfos := make([]*models.UserInfo, len(euas))
		for _, eua := range euas {
			userInfos = append(userInfos, &models.UserInfo{
				Username:    eua,
				DisplayName: "Mc Lovin",
				Email:       "mclovin@example.com",
			})
		}
		return userInfos, nil
	}

	meetingTime, err := time.Parse(time.RFC3339, "2022-10-10T12:00:00+00:00")
	suite.NoError(err)

	updated, err := UpdateTRBRequestConsultMeetingTime(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		nil,
		fetchUserInfo,
		fetchUserInfos,
		trb.ID,
		meetingTime,
		true,
		[]string{"mclovin@example.com"},
		"See you then!",
	)

	suite.NoError(err)
	suite.True((*updated.ConsultMeetingTime).Equal(meetingTime))
}

// TestUpdateTRBRequestTRBLead tests the scheduling of consult meeting
func (suite *ResolverSuite) TestUpdateTRBRequestTRBLead() {
	trb, err := CreateTRBRequest(suite.testConfigs.Context, models.TRBTBrainstorm, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(trb)

	fetchUserInfo := func(ctx context.Context, eua string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    eua,
			DisplayName: "Mc Lovin",
			Email:       "mclovin@example.com",
		}, nil
	}

	updated, err := UpdateTRBRequestTRBLead(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		nil,
		fetchUserInfo,
		trb.ID,
		"MCLV",
	)

	suite.NoError(err)
	suite.EqualValues("MCLV", *updated.TRBLead)
}

// TestIsRecentTRBRequest tests the IsRecentTRBRequest function
func (suite *ResolverSuite) TestIsRecentTRBRequest() {
	tests := []struct {
		numDaysOld      int
		isLeadAssigned  bool
		isRequestClosed bool
		expected        bool
	}{{
		numDaysOld:      10,
		isLeadAssigned:  false,
		isRequestClosed: false,
		expected:        true,
	}, {
		numDaysOld:      10,
		isLeadAssigned:  true,
		isRequestClosed: false,
		expected:        false,
	}, {
		numDaysOld:      10,
		isLeadAssigned:  true,
		isRequestClosed: true,
		expected:        false,
	}, {
		numDaysOld:      5,
		isLeadAssigned:  true,
		isRequestClosed: false,
		expected:        true,
	}, {
		numDaysOld:      5,
		isLeadAssigned:  false,
		isRequestClosed: false,
		expected:        true,
	}, {
		numDaysOld:      5,
		isLeadAssigned:  false,
		isRequestClosed: true,
		expected:        false,
	}}

	// Set up mocked "now" time
	dateOnlyLayout := "2006-01-02"
	now, err := time.Parse(dateOnlyLayout, "2020-01-10")
	suite.NoError(err)

	// Run all tests
	for _, test := range tests {
		suite.Run(fmt.Sprintf("numDaysOld=%d, isLeadAssigned=%t, isRequestClosed=%t, expected=%t", test.numDaysOld, test.isLeadAssigned, test.isRequestClosed, test.expected), func() {
			trb := models.NewTRBRequest(suite.testConfigs.Principal.ID())
			trb.CreatedAt = now.AddDate(0, 0, -test.numDaysOld)
			if test.isLeadAssigned {
				trb.TRBLead = zero.StringFrom("TRBA").Ptr()
			}
			if test.isRequestClosed {
				trb.State = models.TRBRequestStateClosed
			}
			suite.Equal(test.expected, IsRecentTRBRequest(suite.testConfigs.Context, trb, now))
		})
	}
}
