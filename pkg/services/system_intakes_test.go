package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/guregu/null"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestFetchSystemIntakes() {
	requesterID := "REQ"
	requester := &authentication.EUAPrincipal{EUAID: requesterID, JobCodeEASi: true}
	reviewerID := "GRT"
	reviewer := &authentication.EUAPrincipal{EUAID: reviewerID, JobCodeEASi: true, JobCodeGRT: true}
	serviceConfig := NewConfig(nil, nil)

	fnAuth := AuthorizeHasEASiRole

	fnByID := func(ctx context.Context, euaID string) (models.SystemIntakes, error) {
		return models.SystemIntakes{
			models.SystemIntake{EUAUserID: null.StringFrom(euaID)},
		}, nil
	}
	fnByIDFail := func(ctx context.Context, euaID string) (models.SystemIntakes, error) {
		return nil, errors.New("forced error")
	}

	fnAll := func(ctx context.Context) (models.SystemIntakes, error) {
		return models.SystemIntakes{
			models.SystemIntake{EUAUserID: null.StringFrom(reviewerID)},
			models.SystemIntake{EUAUserID: null.StringFrom(requesterID)},
		}, nil
	}
	fnAllFail := func(ctx context.Context) (models.SystemIntakes, error) { return nil, errors.New("forced error") }

	fnByFilter := func(ctx context.Context, statuses []models.SystemIntakeStatus) (models.SystemIntakes, error) {
		return models.SystemIntakes{
			models.SystemIntake{},
		}, nil
	}
	fnByFilterFail := func(ctx context.Context, statuses []models.SystemIntakeStatus) (models.SystemIntakes, error) {
		return nil, errors.New("forced error")
	}

	testCases := map[string]struct {
		ctx    context.Context
		fn     func(context.Context, models.SystemIntakeStatusFilter) (models.SystemIntakes, error)
		filter models.SystemIntakeStatusFilter
		fail   bool
	}{
		"happy path requester": {
			appcontext.WithPrincipal(context.Background(), requester),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAllFail, fnByFilterFail, fnAuth),
			models.SystemIntakeStatusFilter(""),
			false,
		},
		"happy path reviewer fetch all": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByIDFail, fnAll, fnByFilterFail, fnAuth),
			models.SystemIntakeStatusFilter(""),
			false,
		},
		"happy path reviewer filter": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByIDFail, fnAllFail, fnByFilter, fnAuth),
			models.SystemIntakeStatusFilterOPEN,
			false,
		},
		"fail authorization": {
			context.Background(),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAll, fnByFilter, fnAuth),
			models.SystemIntakeStatusFilter(""),
			true,
		},
		"fail requester data access": {
			appcontext.WithPrincipal(context.Background(), requester),
			NewFetchSystemIntakes(serviceConfig, fnByIDFail, fnAll, fnByFilter, fnAuth),
			models.SystemIntakeStatusFilter(""),
			true,
		},
		"fail reviewer fetch all data access": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAllFail, fnByFilter, fnAuth),
			models.SystemIntakeStatusFilter(""),
			true,
		},
		"fail reviewer filter data access": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAll, fnByFilterFail, fnAuth),
			models.SystemIntakeStatusFilterOPEN,
			true,
		},
		"fail reviewer filter name": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAll, fnByFilter, fnAuth),
			models.SystemIntakeStatusFilter("blue"),
			true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			intakes, err := tc.fn(tc.ctx, tc.filter)

			if tc.fail {
				s.Error(err)
				return
			}
			s.NoError(err)
			s.GreaterOrEqual(len(intakes), 1)
		})
	}
}

func (s ServicesTestSuite) TestNewCreateSystemIntake() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"
	requester := "Test Requester"
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	ctx := context.Background()
	ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: fakeEuaID, JobCodeEASi: true})

	s.Run("successfully creates a system intake without an error", func() {
		create := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				EUAUserID: intake.EUAUserID,
				Requester: requester,
				Status:    models.SystemIntakeStatusINTAKEDRAFT,
			}, nil
		}
		createIntake := NewCreateSystemIntake(serviceConfig, create)
		intake, err := createIntake(ctx, &models.SystemIntake{
			Requester: requester,
			Status:    models.SystemIntakeStatusINTAKEDRAFT,
		})
		s.NoError(err)
		s.Equal(fakeEuaID, intake.EUAUserID.ValueOrZero())
	})

	s.Run("returns query error when create fails", func() {
		create := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("creation failed")
		}
		createIntake := NewCreateSystemIntake(serviceConfig, create)
		intake, err := createIntake(ctx, &models.SystemIntake{
			Requester: requester,
			Status:    models.SystemIntakeStatusINTAKEDRAFT,
		})
		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestNewUpdateSystemIntake() {
	nilIntake := (*models.SystemIntake)(nil)
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}

	existing := models.SystemIntake{Requester: "existing"}
	incoming := models.SystemIntake{Requester: "incoming"}
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &existing, nil
	}
	s.Run("golden path update draft intake", func() {
		updateDraftSystemIntake := NewUpdateSystemIntake(serviceConfig, fetch, update, authorize)
		intake, err := updateDraftSystemIntake(ctx, &incoming)

		s.NoError(err)
		s.Equal(&incoming, intake)
	})

	s.Run("returns not found error if fetch fails", func() {
		failFetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return nil, errors.New("fetch error")
		}
		updateDraftSystemIntake := NewUpdateSystemIntake(serviceConfig, failFetch, update, authorize)
		intake, err := updateDraftSystemIntake(ctx, &incoming)

		s.IsType(&apperrors.ResourceNotFoundError{}, err)
		s.Equal(nilIntake, intake)
	})

	s.Run("returns error from authorization if authorization fails", func() {
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		updateDraftSystemIntake := NewUpdateSystemIntake(serviceConfig, fetch, update, failAuthorize)
		intake, err := updateDraftSystemIntake(ctx, &incoming)

		s.Equal(authorizationError, err)
		s.Equal(nilIntake, intake)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		updateDraftSystemIntake := NewUpdateSystemIntake(serviceConfig, fetch, update, unauthorize)
		intake, err := updateDraftSystemIntake(ctx, &incoming)

		s.IsType(&apperrors.UnauthorizedError{}, err)
		s.Equal(nilIntake, intake)
	})

	s.Run("returns query error if update fails", func() {
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		updateDraftSystemIntake := NewUpdateSystemIntake(serviceConfig, fetch, failUpdate, authorize)
		intake, err := updateDraftSystemIntake(ctx, &incoming)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(nilIntake, intake)
	})
}

func (s ServicesTestSuite) TestSystemIntakeByIDFetcher() {
	logger := zap.NewNop()
	fakeID := uuid.New()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	authorize := func(context context.Context) (bool, error) { return true, nil }

	s.Run("successfully fetches System Intake by ID without an error", func() {
		fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID: fakeID,
			}, nil
		}
		fetchSystemIntakeByID := NewFetchSystemIntakeByID(serviceConfig, fetch, authorize)
		intake, err := fetchSystemIntakeByID(context.Background(), fakeID)
		s.NoError(err)

		s.Equal(fakeID, intake.ID)
	})

	s.Run("returns query error when save fails", func() {
		fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("save failed")
		}
		fetchSystemIntakeByID := NewFetchSystemIntakeByID(serviceConfig, fetch, authorize)

		intake, err := fetchSystemIntakeByID(context.Background(), uuid.New())

		s.IsType(&apperrors.QueryError{}, err)
		s.Nil(intake)
	})
}

func (s ServicesTestSuite) TestSystemIntakeArchiver() {
	logger := zap.NewNop()
	fakeID := uuid.New()
	businessCaseID := uuid.New()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	ctx := context.Background()

	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			ID:             id,
			BusinessCaseID: &businessCaseID,
		}, nil
	}
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	archiveBusinessCase := func(ctx context.Context, id uuid.UUID) error {
		return nil
	}
	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}
	sendWithdrawEmail := func(ctx context.Context, requestName string) error {
		return nil
	}

	s.Run("golden path archive system intake", func() {
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, archiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.NoError(err)
	})

	s.Run("returns query error when fetch fails", func() {
		failFetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("fetch failed")
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, failFetch, update, archiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error when authorization errors", func() {
		actualError := errors.New("authorize failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, actualError
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, archiveBusinessCase, failAuthorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.Error(err)
		s.Equal(actualError, err)
	})

	s.Run("returns unauthorized error when authorization not ok", func() {
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, archiveBusinessCase, failAuthorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error from archive business case", func() {
		actualError := errors.New("failed to archive business case")
		failArchiveBusinessCase := func(ctx context.Context, id uuid.UUID) error {
			return actualError
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, failArchiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.Error(err)
		s.Equal(actualError, err)
	})

	s.Run("returns query error when update fails", func() {
		failUpdate := func(ctx context.Context, businessCase *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update failed")
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, failUpdate, archiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.IsType(&apperrors.QueryError{}, err)
	})
}

func (s ServicesTestSuite) TestUpdateLifecycleFields() {
	lifecycleID := null.StringFrom("010010")
	today := time.Now()
	expiresAt := &today
	nextSteps := null.StringFrom(fmt.Sprintf("next %s", today))
	scope := null.StringFrom(fmt.Sprintf("scope %s", today))

	input := &models.SystemIntake{
		ID:                 uuid.New(),
		LifecycleID:        lifecycleID,
		LifecycleExpiresAt: expiresAt,
		DecisionNextSteps:  nextSteps,
		LifecycleScope:     scope,
	}
	action := &models.Action{
		IntakeID: &input.ID,
		Feedback: null.StringFrom("Feedback"),
	}

	fnAuthorize := func(context.Context) (bool, error) { return true, nil }
	fnFetch := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{ID: id}, nil
	}
	fnUpdate := func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
		if i.LifecycleID.ValueOrZero() == "" {
			return nil, errors.New("missing lcid")
		}
		if !i.LifecycleExpiresAt.Equal(today) {
			return nil, errors.New("incorrect date")
		}
		if !i.DecisionNextSteps.Equal(input.DecisionNextSteps) {
			return nil, errors.New("incorrect next")
		}
		if !i.LifecycleScope.Equal(input.LifecycleScope) {
			return nil, errors.New("incorrect scope")
		}
		return i, nil
	}
	fnSaveAction := func(c context.Context, action *models.Action) error {
		return nil
	}
	fnFetchUserInfo := func(_ context.Context, euaID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Email:      "name@site.com",
			CommonName: "NAME",
			EuaUserID:  testhelpers.RandomEUAID(),
		}, nil
	}
	reviewEmailCount := 0
	feedbackForEmailText := ""
	fnSendLCIDEmail := func(_ context.Context, _ models.EmailAddress, _ string, _ *time.Time, _ string, _string, emailText string) error {
		feedbackForEmailText = emailText
		reviewEmailCount++
		return nil
	}
	fnGenerate := func(context.Context) (string, error) { return "123456", nil }
	cfg := Config{clock: clock.NewMock()}
	happy := NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnGenerate)

	s.Run("happy path provided lcid", func() {
		intake, err := happy(context.Background(), input, action)
		s.NoError(err)
		s.Equal(intake.LifecycleID, lifecycleID)
		s.Equal(intake.LifecycleExpiresAt, expiresAt)
		s.Equal(intake.DecisionNextSteps, nextSteps)
		s.Equal(intake.LifecycleScope, scope)
		s.Equal(1, reviewEmailCount)
		s.Equal("Feedback", feedbackForEmailText)
	})

	// from here on out, we always expect the LCID to get generated
	input.LifecycleID = null.StringFrom("")

	s.Run("happy path generates lcid", func() {
		intake, err := happy(context.Background(), input, action)
		s.NoError(err)
		s.NotEqual(intake.LifecycleID, "")
		s.Equal(intake.LifecycleExpiresAt, expiresAt)
		s.Equal(intake.DecisionNextSteps, nextSteps)
		s.Equal(intake.LifecycleScope, scope)
	})

	// build the error-generating pieces
	fnAuthorizeErr := func(context.Context) (bool, error) { return false, errors.New("auth error") }
	fnAuthorizeFail := func(context.Context) (bool, error) { return false, nil }
	fnFetchErr := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return nil, errors.New("fetch error")
	}
	fnUpdateErr := func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
		return nil, errors.New("update error")
	}
	fnSaveActionErr := func(c context.Context, a *models.Action) error {
		return errors.New("action error")
	}
	fnFetchUserInfoErr := func(_ context.Context, euaID string) (*models.UserInfo, error) {
		return nil, errors.New("fetch user info error")
	}
	fnSendLCIDEmailErr := func(_ context.Context, _ models.EmailAddress, _ string, _ *time.Time, _ string, _ string, _ string) error {
		return errors.New("send email error")
	}
	fnGenerateErr := func(context.Context) (string, error) { return "", errors.New("gen error") }

	// build the table-driven test of error cases for unhappy path
	testCases := map[string]struct {
		fn func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error)
	}{
		"error path fetch": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetchErr, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnGenerate),
		},
		"error path auth": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorizeErr, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnGenerate),
		},
		"error path auth fail": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorizeFail, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnGenerate),
		},
		"error path generate": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnGenerateErr),
		},
		"error path save action": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveActionErr, fnFetchUserInfo, fnSendLCIDEmail, fnGenerate),
		},
		"error path fetch user info": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfoErr, fnSendLCIDEmail, fnGenerate),
		},
		"error path send email": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmailErr, fnGenerate),
		},
		"error path update": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdateErr, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnGenerate),
		},
	}

	for expectedErr, tc := range testCases {
		s.Run(expectedErr, func() {
			_, err := tc.fn(context.Background(), input, action)
			s.Error(err)
		})
	}
}

func (s ServicesTestSuite) TestUpdateRejectionFields() {
	today := time.Now()
	nextSteps := null.StringFrom(fmt.Sprintf("next %s", today))
	reason := null.StringFrom(fmt.Sprintf("reason %s", today))

	input := &models.SystemIntake{
		ID:                uuid.New(),
		DecisionNextSteps: nextSteps,
		RejectionReason:   reason,
	}
	action := &models.Action{
		IntakeID: &input.ID,
		Feedback: null.StringFrom("Feedback"),
	}

	fnAuthorize := func(context.Context) (bool, error) { return true, nil }
	fnFetch := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{ID: id}, nil
	}
	fnUpdate := func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
		if !i.DecisionNextSteps.Equal(input.DecisionNextSteps) {
			return nil, errors.New("incorrect next")
		}
		if !i.LifecycleScope.Equal(input.LifecycleScope) {
			return nil, errors.New("incorrect scope")
		}
		return i, nil
	}
	fnSaveAction := func(c context.Context, action *models.Action) error {
		return nil
	}
	fnFetchUserInfo := func(_ context.Context, euaID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Email:      "name@site.com",
			CommonName: "NAME",
			EuaUserID:  testhelpers.RandomEUAID(),
		}, nil
	}
	reviewEmailCount := 0
	feedbackForEmailText := ""
	fnSendRejectRequestEmail := func(ctx context.Context, recipientAddress models.EmailAddress, reason string, nextSteps string, feedback string) error {
		feedbackForEmailText = feedback
		reviewEmailCount++
		return nil
	}
	cfg := Config{clock: clock.NewMock()}
	happy := NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail)

	s.Run("happy path", func() {
		intake, err := happy(context.Background(), input, action)
		s.NoError(err)
		s.Equal(intake.DecisionNextSteps, nextSteps)
		s.Equal(intake.RejectionReason, reason)
		s.Equal(1, reviewEmailCount)
		s.Equal("Feedback", feedbackForEmailText)
	})

	// build the error-generating pieces
	fnAuthorizeErr := func(context.Context) (bool, error) { return false, errors.New("auth error") }
	fnAuthorizeFail := func(context.Context) (bool, error) { return false, nil }
	fnFetchErr := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return nil, errors.New("fetch error")
	}
	fnUpdateErr := func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
		return nil, errors.New("update error")
	}
	fnSaveActionErr := func(c context.Context, a *models.Action) error {
		return errors.New("action error")
	}
	fnFetchUserInfoErr := func(_ context.Context, euaID string) (*models.UserInfo, error) {
		return nil, errors.New("fetch user info error")
	}
	fnSendRejectRequestEmailErr := func(ctx context.Context, recipientAddress models.EmailAddress, reason string, nextSteps string, feedback string) error {
		return errors.New("send email error")
	}

	// build the table-driven test of error cases for unhappy path
	testCases := map[string]struct {
		fn func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error)
	}{
		"error path fetch": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetchErr, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail),
		},
		"error path auth": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorizeErr, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail),
		},
		"error path auth fail": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorizeFail, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail),
		},
		"error path update": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdateErr, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail),
		},
		"error path fetch user info": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfoErr, fnSendRejectRequestEmail),
		},
		"error path save action": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveActionErr, fnFetchUserInfo, fnSendRejectRequestEmail),
		},
		"error path send email": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmailErr),
		},
	}

	for expectedErr, tc := range testCases {
		s.Run(expectedErr, func() {
			_, err := tc.fn(context.Background(), input, action)
			s.Error(err)
		})
	}
}
