package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TestCreateTRBRequest makes a new TRB request
func (s *ResolverSuite) TestCreateTRBRequest() {
	//TODO get the context in the test configs
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	s.EqualValues(false, trb.Archived)
	s.Nil(trb.Name)
	s.EqualValues(models.TRBRequestStateOpen, trb.State)
	s.EqualValues(s.testConfigs.Principal.EUAID, trb.CreatedBy)
	s.NotNil(trb.ID)
	s.NotNil(trb.CreatedAt)
	s.Nil(trb.ModifiedBy)
	s.Nil(trb.ModifiedAt)
}

// TestUpdateTRBRequest updates a TRB request
func (s *ResolverSuite) TestUpdateTRBRequest() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
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
	s.EqualValues(*updated.Name, "Testing")
	s.EqualValues(updated.State, models.TRBRequestStateClosed)
	s.EqualValues(updated.Archived, false)
	s.EqualValues(updated.ModifiedBy, &princ)
	s.NotNil(updated.ModifiedAt)
}

// TestGetTRBRequestByID returns a TRB request by it's ID
func (s *ResolverSuite) TestGetTRBRequestByID() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	ret, err := GetTRBRequestByID(s.testConfigs.Context, s.testConfigs.Store, trb.ID)
	s.NoError(err)
	s.NotNil(ret)
}

// TestGetTRBRequests returns all TRB Requests
func (s *ResolverSuite) TestGetTRBRequests() {
	// Create a context to use for requests from another user
	principalABCD := &authentication.EUAPrincipal{
		EUAID:           "ABCD",
		JobCodeEASi:     true,
		JobCodeGRT:      true,
		JobCodeTRBAdmin: true,
	}
	ctxABCD := appcontext.WithLogger(context.Background(), s.testConfigs.Logger)
	ctxABCD = appcontext.WithPrincipal(ctxABCD, principalABCD)

	// Create a TRB request with TEST
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	// Check TEST sees 1 request
	col, err := GetTRBRequests(s.testConfigs.Context, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trb, col[0])

	// Create a TRB request under ABCD
	trb2, err := CreateTRBRequest(ctxABCD, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb2)
	//Check for 2 request
	col, err = GetTRBRequests(s.testConfigs.Context, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 2)

	changes := map[string]interface{}{
		"state":    models.TRBRequestStateClosed,
		"archived": true,
	}

	// archive
	trbUpdate, err := UpdateTRBRequest(ctxABCD, trb2.ID, changes, s.testConfigs.Store)
	s.NoError(err)

	// GET archived collection from ABCD's perspective
	col, err = GetTRBRequests(ctxABCD, s.testConfigs.Store, true)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trbUpdate, col[0])
}

// TestGetMyTRBRequests returns a users TRB Requests
func (s *ResolverSuite) TestGetMyTRBRequests() {
	// Create a context to use for requests from another user
	principalABCD := &authentication.EUAPrincipal{
		EUAID:           "ABCD",
		JobCodeEASi:     true,
		JobCodeGRT:      true,
		JobCodeTRBAdmin: true,
	}
	ctxABCD := appcontext.WithLogger(context.Background(), s.testConfigs.Logger)
	ctxABCD = appcontext.WithPrincipal(ctxABCD, principalABCD)

	// Create a TRB request with TEST
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	// Check TEST sees 1 request
	col, err := GetMyTRBRequests(s.testConfigs.Context, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trb, col[0])

	// Check ABCD sees 0 requests
	col, err = GetMyTRBRequests(ctxABCD, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 0)

	// Create a TRB request under ABCD
	trb2, err := CreateTRBRequest(ctxABCD, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb2)

	// TEST should see 1 request (their already created one)
	col, err = GetMyTRBRequests(s.testConfigs.Context, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trb, col[0])

	// ABCD should see 1 request (the one we just created)
	col, err = GetMyTRBRequests(ctxABCD, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trb2, col[0])

	changes := map[string]interface{}{
		"state":    models.TRBRequestStateClosed,
		"archived": true,
	}

	// archive ABCD's request
	trbUpdate, err := UpdateTRBRequest(ctxABCD, trb2.ID, changes, s.testConfigs.Store)
	s.NoError(err)

	// GET collection from ABCD's perspective and expect to not see any
	col, err = GetMyTRBRequests(ctxABCD, s.testConfigs.Store, false)
	s.NoError(err)
	s.Len(col, 0)

	// GET collection from ABCD's perspective (with archived true) and expect to see one
	col, err = GetMyTRBRequests(ctxABCD, s.testConfigs.Store, true)
	s.NoError(err)
	s.Len(col, 1)
	s.EqualValues(trbUpdate, col[0])
}

// TestUpdateTRBRequestConsultMeetingTime tests the scheduling of consult meeting
func (s *ResolverSuite) TestUpdateTRBRequestConsultMeetingTime() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

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
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	fetchUserInfo := func(ctx context.Context, eua string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    eua,
			DisplayName: "Mc Lovin",
			Email:       "mclovin@example.com",
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

	// check that you cannot change the TRB lead on a closed TRB request
	_, err = UpdateTRBRequest(s.testConfigs.Context,
		trb.ID,
		map[string]interface{}{
			"state": models.TRBRequestStateClosed,
		},
		s.testConfigs.Store)
	s.NoError(err)

	_, err = UpdateTRBRequestTRBLead(
		s.testConfigs.Context,
		s.testConfigs.Store,
		nil,
		fetchUserInfo,
		trb.ID,
		"MCLV",
	)
	s.Error(err)
}

// TestIsRecentTRBRequest tests the IsRecentTRBRequest function
func (s *ResolverSuite) TestIsRecentTRBRequest() {
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
	s.NoError(err)

	// Run all tests
	for _, test := range tests {
		s.Run(fmt.Sprintf("numDaysOld=%d, isLeadAssigned=%t, isRequestClosed=%t, expected=%t", test.numDaysOld, test.isLeadAssigned, test.isRequestClosed, test.expected), func() {
			trb := models.NewTRBRequest(s.testConfigs.Principal.ID())
			trb.CreatedAt = now.AddDate(0, 0, -test.numDaysOld)
			if test.isLeadAssigned {
				trb.TRBLead = zero.StringFrom("TRBA").Ptr()
			}
			if test.isRequestClosed {
				trb.State = models.TRBRequestStateClosed
			}
			s.Equal(test.expected, IsRecentTRBRequest(s.testConfigs.Context, trb, now))
		})
	}
}
