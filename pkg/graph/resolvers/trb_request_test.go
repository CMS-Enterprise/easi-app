package resolvers

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequest makes a new TRB request
func (s *ResolverSuite) TestCreateTRBRequest() {
	//TODO get the context in the test configs
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	s.EqualValues(false, trb.Archived)
	s.EqualValues("Draft", trb.Name)
	s.EqualValues(models.TRBRequestStateOpen, trb.State)
	s.EqualValues(s.testConfigs.Principal.EUAID, trb.CreatedBy)
	s.NotNil(trb.ID)
	s.NotNil(trb.CreatedAt)
	s.Nil(trb.ModifiedBy)
	s.Nil(trb.ModifiedAt)
}

// TestUpdateTRBRequest updates a TRB request
func (s *ResolverSuite) TestUpdateTRBRequest() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	changes := map[string]interface{}{
		"Name":     "Testing",
		"state":    models.TRBRequestStateClosed,
		"archived": false,
	}
	princ := s.testConfigs.Principal.ID()

	updated, err := UpdateTRBRequest(s.testConfigs.Context, trb.ID, changes, s.testConfigs.Store)
	s.NotNil(updated)
	s.NoError(err)
	s.EqualValues(updated.Name, "Testing")
	s.EqualValues(updated.State, models.TRBRequestStateClosed)
	s.EqualValues(updated.Archived, false)
	s.EqualValues(updated.ModifiedBy, &princ)
	s.NotNil(updated.ModifiedAt)
}

// TestGetTRBRequestByID returns a TRB request by it's ID
func (s *ResolverSuite) TestGetTRBRequestByID() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	ret, err := GetTRBRequestByID(s.testConfigs.Context, trb.ID, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(ret)
}

// TestGetTRBRequests returns all TRB Requests
func (s *ResolverSuite) TestGetTRBRequests() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)
	//Check we return 1 value
	col, err := GetTRBRequests(s.testConfigs.Context, false, s.testConfigs.Store)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trb, col[0])

	trb2, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb2)
	//Check for 2 request
	col, err = GetTRBRequests(s.testConfigs.Context, false, s.testConfigs.Store)
	s.NoError(err)
	s.Len(col, 2)

	changes := map[string]interface{}{
		"state":    models.TRBRequestStateClosed,
		"archived": true,
	}

	//archive
	trbUpdate, err := UpdateTRBRequest(s.testConfigs.Context, trb2.ID, changes, s.testConfigs.Store)
	s.NoError(err)

	//GET archived collection
	col, err = GetTRBRequests(s.testConfigs.Context, true, s.testConfigs.Store)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trbUpdate, col[0])
}

// TestUpdateTRBRequestConsultMeetingTime tests the scheduling of consult meeting
func (s *ResolverSuite) TestUpdateTRBRequestConsultMeetingTime() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
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

	meetingTime, err := time.Parse(time.RFC3339, "2022-10-10T12:00:00+00:00")
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

	s.NoError(err)
	s.True((*updated.ConsultMeetingTime).Equal(meetingTime))
}

// TestUpdateTRBRequestTRBLead tests the scheduling of consult meeting
func (s *ResolverSuite) TestUpdateTRBRequestTRBLead() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	fetchUserInfo := func(ctx context.Context, eua string) (*models.UserInfo, error) {
		return &models.UserInfo{
			EuaUserID:  eua,
			CommonName: "Mc Lovin",
			Email:      "mclovin@example.com",
		}, nil
	}

	updated, err := UpdateTRBRequestTRBLead(
		s.testConfigs.Context,
		s.testConfigs.Store,
		nil,
		fetchUserInfo,
		trb.ID,
		"MCLV",
	)

	s.NoError(err)
	s.EqualValues("MCLV", *updated.TRBLead)
}

func (s *ResolverSuite) TestIsRecentTRBRequest() {
	// Set up a date to mock the current time
	dateOnlyLayout := "2006-01-02"
	now, err := time.Parse(dateOnlyLayout, "2020-01-10")
	s.NoError(err)

	// 10 Days old
	tenDaysOld := models.NewTRBRequest(s.testConfigs.DBConfig.Username)
	tenDaysOld.CreatedAt = now.AddDate(0, 0, -10)
	s.False(IsRecentTRBRequest(s.testConfigs.Context, tenDaysOld, now))

	// 6 days old
	sixDaysOld := models.NewTRBRequest(s.testConfigs.DBConfig.Username)
	sixDaysOld.CreatedAt = now.AddDate(0, 0, -6)
	s.True(IsRecentTRBRequest(s.testConfigs.Context, sixDaysOld, now))

	// 0 days old
	zeroDaysOld := models.NewTRBRequest(s.testConfigs.DBConfig.Username)
	zeroDaysOld.CreatedAt = now
	s.True(IsRecentTRBRequest(s.testConfigs.Context, zeroDaysOld, now))
}
