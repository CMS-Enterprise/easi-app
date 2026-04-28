package resolvers

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
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

func (s *ResolverSuite) TestUpdateTRBRequestUnauthorized() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	otherCtx, _ := s.getTestContextWithPrincipal("ABCD", false)
	adminCtx, _ := s.getTestContextWithPrincipal("TRBA", true)

	leadEUA := "LEAD"
	trb.TRBLead = &leadEUA
	trb, err = s.testConfigs.Store.UpdateTRBRequest(s.testConfigs.Context, trb)
	s.NoError(err)

	leadCtx, _ := s.getTestContextWithPrincipal(leadEUA, false)

	changes := map[string]interface{}{
		"Name": "Testing",
	}

	var unauthorizedErr *apperrors.UnauthorizedError
	for _, ctx := range []context.Context{otherCtx, adminCtx, leadCtx} {
		_, err = UpdateTRBRequest(ctx, trb.ID, changes, s.testConfigs.Store)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}
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

func (s *ResolverSuite) TestTRBRequestGuidanceLetterVisibility() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	letter, err := CreateTRBGuidanceLetter(s.testConfigs.Context, s.testConfigs.Store, trb.ID)
	s.NoError(err)
	s.NotNil(letter)

	resolver := &tRBRequestResolver{&Resolver{store: s.testConfigs.Store}}

	ownerLetter, err := resolver.GuidanceLetter(s.ctxWithNewDataloaders(), trb)
	s.NoError(err)
	s.Nil(ownerLetter)

	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	adminLetter, err := resolver.GuidanceLetter(adminCtx, trb)
	s.NoError(err)
	s.NotNil(adminLetter)
	s.Equal(letter.ID, adminLetter.ID)

	_, err = s.testConfigs.Store.UpdateTRBGuidanceLetterStatus(
		s.testConfigs.Context,
		letter.ID,
		models.TRBGuidanceLetterStatusCompleted,
	)
	s.NoError(err)

	completedOwnerLetter, err := resolver.GuidanceLetter(s.ctxWithNewDataloaders(), trb)
	s.NoError(err)
	s.NotNil(completedOwnerLetter)
	s.Equal(letter.ID, completedOwnerLetter.ID)
}

func (s *ResolverSuite) TestTRBRequestAuthorizationHelpers() {
	trb, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trb)

	leadEUA := "LEAD"
	trb.TRBLead = &leadEUA
	trb, err = s.testConfigs.Store.UpdateTRBRequest(s.testConfigs.Context, trb)
	s.NoError(err)

	ownerCtx := s.testConfigs.Context
	adminCtx, _ := s.getTestContextWithPrincipal("TRBA", true)
	leadCtx, _ := s.getTestContextWithPrincipal(leadEUA, false)
	otherCtx, _ := s.getTestContextWithPrincipal("ABCD", false)

	s.NoError(authorizeUserCanViewTRBRequest(ownerCtx, trb))
	s.NoError(authorizeUserCanViewTRBRequest(adminCtx, trb))
	s.NoError(authorizeUserCanViewTRBRequest(leadCtx, trb))

	viewErr := authorizeUserCanViewTRBRequest(otherCtx, trb)
	s.Error(viewErr)

	s.NoError(authorizeUserCanEditOwnTRBRequest(ownerCtx, trb))
	for _, ctx := range []context.Context{adminCtx, leadCtx, otherCtx} {
		editErr := authorizeUserCanEditOwnTRBRequest(ctx, trb)
		s.Error(editErr)
	}

	s.NoError(authorizeUserCanManageTRBRequestRelations(ownerCtx, trb))
	s.NoError(authorizeUserCanManageTRBRequestRelations(adminCtx, trb))
	for _, ctx := range []context.Context{leadCtx, otherCtx} {
		relationErr := authorizeUserCanManageTRBRequestRelations(ctx, trb)
		s.Error(relationErr)
	}
}

func (s *ResolverSuite) TestTRBRequestLCIDOptionsPermissions() {
	queryResolver := s.systemIntakeQueryResolver()

	lcidIntake := s.createNewIntakeWithResolver(func(intake *models.SystemIntake) {
		intake.ProjectName = null.StringFrom("LCID source intake")
		intake.LifecycleID = null.StringFrom("000001")
	})

	trbRequest := s.createNewTRBRequest()

	leadEUA := "LEAD"
	trbRequest.TRBLead = &leadEUA
	trbRequest, err := s.testConfigs.Store.UpdateTRBRequest(s.testConfigs.Context, trbRequest)
	s.NoError(err)

	ownerCtx := s.testConfigs.Context
	adminCtx, _ := s.getTestContextWithPrincipal("TRBA", true)
	leadCtx, _ := s.getTestContextWithPrincipal(leadEUA, false)
	otherCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	options, err := queryResolver.TrbRequestLcidOptions(ownerCtx, trbRequest.ID)
	s.NoError(err)
	s.NotEmpty(options)

	optionByID := map[uuid.UUID]*models.SystemIntakeLCIDOption{}
	for _, option := range options {
		optionByID[option.ID] = option
	}

	s.Contains(optionByID, lcidIntake.ID)
	s.Equal("000001", optionByID[lcidIntake.ID].LCID.ValueOrZero())
	s.Equal("LCID source intake", optionByID[lcidIntake.ID].RequestName.ValueOrZero())

	var unauthorizedErr *apperrors.UnauthorizedError
	for _, ctx := range []context.Context{adminCtx, leadCtx, otherCtx} {
		_, err = queryResolver.TrbRequestLcidOptions(ctx, trbRequest.ID)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}
}

func (s *ResolverSuite) TestTRBRequestNestedRelationVisibility() {
	const sharedContractNumber = "CN-12345"

	ownerTRB := s.createNewTRBRequest()

	otherCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	hiddenTRB, err := CreateTRBRequest(otherCtx, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(hiddenTRB)

	hiddenIntake, err := CreateSystemIntake(
		otherCtx,
		s.testConfigs.Store,
		models.CreateSystemIntakeInput{
			Requester: &models.SystemIntakeRequesterInput{
				Name: "Other User",
			},
			RequestType: models.SystemIntakeRequestTypeNEW,
		},
		userhelpers.GetUserInfoAccountInfoWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfo),
	)
	s.NoError(err)
	s.NotNil(hiddenIntake)

	err = sqlutils.WithTransaction(s.testConfigs.Context, s.testConfigs.Store, func(tx *sqlx.Tx) error {
		if err := s.testConfigs.Store.SetTRBRequestContractNumbers(s.testConfigs.Context, tx, ownerTRB.ID, []string{sharedContractNumber}); err != nil {
			return err
		}
		if err := s.testConfigs.Store.SetTRBRequestContractNumbers(s.testConfigs.Context, tx, hiddenTRB.ID, []string{sharedContractNumber}); err != nil {
			return err
		}
		if err := s.testConfigs.Store.SetSystemIntakeContractNumbers(s.testConfigs.Context, tx, hiddenIntake.ID, []string{sharedContractNumber}); err != nil {
			return err
		}
		return nil
	})
	s.NoError(err)

	_, err = s.testConfigs.Store.CreateTRBRequestSystemIntakes(s.testConfigs.Context, ownerTRB.ID, []uuid.UUID{hiddenIntake.ID})
	s.NoError(err)

	rawRelatedTRBRequests, err := TRBRequestRelatedTRBRequests(s.ctxWithNewDataloaders(), ownerTRB.ID)
	s.NoError(err)
	s.Len(rawRelatedTRBRequests, 1)
	s.Equal(hiddenTRB.ID, rawRelatedTRBRequests[0].ID)

	rawRelatedIntakes, err := TRBRequestRelatedSystemIntakes(s.ctxWithNewDataloaders(), ownerTRB.ID)
	s.NoError(err)
	s.Len(rawRelatedIntakes, 1)
	s.Equal(hiddenIntake.ID, rawRelatedIntakes[0].ID)

	rawFormIntakes, err := GetTRBRequestFormSystemIntakesByTRBRequestID(s.ctxWithNewDataloaders(), ownerTRB.ID)
	s.NoError(err)
	s.Len(rawFormIntakes, 1)
	s.Equal(hiddenIntake.ID, rawFormIntakes[0].ID)

	resolver := &Resolver{store: s.testConfigs.Store}
	trbResolver := &tRBRequestResolver{resolver}
	formResolver := &tRBRequestFormResolver{resolver}

	ownerCtx := s.ctxWithNewDataloaders()

	visibleRelatedTRBRequests, err := trbResolver.RelatedTRBRequests(ownerCtx, ownerTRB)
	s.NoError(err)
	s.Len(visibleRelatedTRBRequests, 0)

	visibleRelatedIntakes, err := trbResolver.RelatedIntakes(ownerCtx, ownerTRB)
	s.NoError(err)
	s.Len(visibleRelatedIntakes, 0)

	visibleFormIntakes, err := formResolver.SystemIntakes(ownerCtx, &models.TRBRequestForm{TRBRequestID: ownerTRB.ID})
	s.NoError(err)
	s.Len(visibleFormIntakes, 0)

	adminCtx, _ := s.getTestContextWithPrincipal("TRBA", true)

	adminRelatedTRBRequests, err := trbResolver.RelatedTRBRequests(adminCtx, ownerTRB)
	s.NoError(err)
	s.Len(adminRelatedTRBRequests, 1)
	s.Equal(hiddenTRB.ID, adminRelatedTRBRequests[0].ID)

	adminRelatedIntakes, err := trbResolver.RelatedIntakes(adminCtx, ownerTRB)
	s.NoError(err)
	s.Len(adminRelatedIntakes, 1)
	s.Equal(hiddenIntake.ID, adminRelatedIntakes[0].ID)

	adminFormIntakes, err := formResolver.SystemIntakes(adminCtx, &models.TRBRequestForm{TRBRequestID: ownerTRB.ID})
	s.NoError(err)
	s.Len(adminFormIntakes, 1)
	s.Equal(hiddenIntake.ID, adminFormIntakes[0].ID)
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
