package resolvers

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequest makes a new TRB request
func (suite *ResolverSuite) TestCreateTRBRequest() {
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

// TestUpdateTRBRequest updates a TRB request
func (suite *ResolverSuite) TestUpdateTRBRequest() {
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

// TestUpdateTRBRequestConsultMeetingTime tests the scheduling of consult meeting
func (s *ResolverSuite) TestUpdateTRBRequestConsultMeetingTime() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	fetchUserInfo := func(ctx context.Context, eua string) (*models.UserInfo, error) {
		return &models.UserInfo{
			EuaUserID:  eua,
			CommonName: "Mc Lovin",
			Email:      "mclovin@example.com",
		}, nil
	}

	fetchUserInfos := func(ctx context.Context, euas []string) ([]*models.UserInfo, error) {
		userInfos := make([]*models.UserInfo, len(euas))
		for _, eua := range euas {
			userInfos = append(userInfos, &models.UserInfo{
				EuaUserID:  eua,
				CommonName: "Mc Lovin",
				Email:      "mclovin@example.com",
			})
		}
		return userInfos, nil
	}

	meetingTime, err := time.Parse(time.RFC3339, "2022-01-01T13:30:00+00:00")
	s.NoError(err)

	updated, err := UpdateTRBRequestConsultMeetingTime(
		s.testConfigs.Context,
		s.testConfigs.Store,
		nil,
		fetchUserInfo,
		fetchUserInfos,
		trb.ID,
		meetingTime,
		true,
		[]string{"mclovin@example.com"},
		"See you then!",
	)

	s.EqualValues(&meetingTime, updated.ConsultMeetingTime)
}

// TestUpdateTRBRequestTRBLead tests the scheduling of consult meeting
func (s *ResolverSuite) TestUpdateTRBRequestTRBLead() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	fetchUserInfo := func(ctx context.Context, eua string) (*models.UserInfo, error) {
		return &models.UserInfo{
			EuaUserID:  eua,
			CommonName: "Mc Lovin",
			Email:      "mclovin@example.com",
		}, nil
	}

	fetchUserInfos := func(ctx context.Context, euas []string) ([]*models.UserInfo, error) {
		userInfos := make([]*models.UserInfo, len(euas))
		for _, eua := range euas {
			userInfos = append(userInfos, &models.UserInfo{
				EuaUserID:  eua,
				CommonName: "Mc Lovin",
				Email:      "mclovin@example.com",
			})
		}
		return userInfos, nil
	}

	updated, err := UpdateTRBRequestTRBLead(
		s.testConfigs.Context,
		s.testConfigs.Store,
		nil,
		fetchUserInfo,
		fetchUserInfos,
		trb.ID,
		"MCLV",
	)

	s.EqualValues("MCLV", *updated.TRBLead)
}
