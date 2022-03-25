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
	euaID := testhelpers.RandomEUAID()

	fnAuthorize := func(context.Context) (bool, error) { return true, nil }
	fnFetch := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			ID:        id,
			EUAUserID: null.StringFrom(euaID),
		}, nil
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
			EuaUserID:  euaID,
		}, nil
	}
	reviewEmailCount := 0
	feedbackForEmailText := ""
	fnSendLCIDEmail := func(_ context.Context, _ models.EmailAddress, _ string, _ *time.Time, _ string, _ string, _string, emailText string) error {
		feedbackForEmailText = emailText
		reviewEmailCount++
		return nil
	}
	fnSendIntakeInvalidEUAIDEmail := func(_ context.Context, _ string, _ string, _ uuid.UUID) error {
		return nil
	}
	fnSendIntakeNoEUAIDEmail := func(_ context.Context, _ string, _ uuid.UUID) error {
		return nil
	}
	fnGenerate := func(context.Context) (string, error) { return "123456", nil }
	cfg := Config{clock: clock.NewMock()}
	happy := NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate)

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

	// test cases for invalid or missing EUA ID

	s.Run("should send notification of invalid EUA ID when fetchUserInfo returns empty data from CEDAR LDAP", func() {
		fetchEmptyUserInfo := func(context.Context, string) (*models.UserInfo, error) {
			return nil, &apperrors.InvalidEUAIDError{
				EUAID: euaID,
			}
		}

		emailSentForInvalidEUAID := false
		sendIntakeInvalidEUAIDEmailMock := func(ctx context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
			emailSentForInvalidEUAID = true
			return nil
		}

		updateLifecycleFields := NewUpdateLifecycleFields(
			cfg,
			fnAuthorize,
			fnFetch,
			fnUpdate,
			fnSaveAction,
			fetchEmptyUserInfo,
			fnSendLCIDEmail,
			sendIntakeInvalidEUAIDEmailMock,
			fnSendIntakeNoEUAIDEmail,
			fnGenerate,
		)
		_, err := updateLifecycleFields(context.Background(), input, action)
		s.NoError(err)
		s.True(emailSentForInvalidEUAID)
	})

	s.Run("should send notification of empty EUA ID when intake has no associated EUA ID", func() {
		fetchIntakeWithNoEUAID := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID: id,
			}, nil
		}

		emailSentForNoEUAID := false
		sendIntakeForNoEUAIDEmailMock := func(ctx context.Context, projectName string, intakeID uuid.UUID) error {
			emailSentForNoEUAID = true
			return nil
		}

		updateLifecycleFields := NewUpdateLifecycleFields(
			cfg,
			fnAuthorize,
			fetchIntakeWithNoEUAID,
			fnUpdate,
			fnSaveAction,
			fnFetchUserInfo,
			fnSendLCIDEmail,
			fnSendIntakeInvalidEUAIDEmail,
			sendIntakeForNoEUAIDEmailMock,
			fnGenerate,
		)
		_, err := updateLifecycleFields(context.Background(), input, action)
		s.NoError(err)
		s.True(emailSentForNoEUAID)
	})

	// build the error-generating pieces
	fnFetchReturnsNoEUAID := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			ID:        id,
			EUAUserID: null.StringFrom(""),
		}, nil
	}

	fnFetchUserInfoReturnsInvalidEUAID := func(c context.Context, euaID string) (*models.UserInfo, error) {
		return nil, &apperrors.InvalidEUAIDError{
			EUAID: euaID,
		}
	}

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
	fnSendLCIDEmailErr := func(_ context.Context, _ models.EmailAddress, _ string, _ *time.Time, _ string, _ string, _ string, _ string) error {
		return errors.New("send email error")
	}
	fnSendIntakeInvalidEUAIDEmailErr := func(_ context.Context, _ string, _ string, _ uuid.UUID) error {
		return errors.New("send intake invalid EUA ID email error")
	}
	fnSendIntakeNoEUAIDEmailErr := func(_ context.Context, _ string, _ uuid.UUID) error {
		return errors.New("send intake no EUA ID email error")
	}
	fnGenerateErr := func(context.Context) (string, error) { return "", errors.New("gen error") }

	// build the table-driven test of error cases for unhappy path
	testCases := map[string]struct {
		fn func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error)
	}{
		"error path fetch": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetchErr, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path auth": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorizeErr, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path auth fail": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorizeFail, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path generate": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerateErr),
		},
		"error path save action": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveActionErr, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path fetch user info": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfoErr, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path send email": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmailErr, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path send invalid EUA ID email": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfoReturnsInvalidEUAID, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmailErr, fnSendIntakeNoEUAIDEmail, fnGenerate),
		},
		"error path send no EUA ID email": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetchReturnsNoEUAID, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmailErr, fnGenerate),
		},
		"error path update": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdateErr, fnSaveAction, fnFetchUserInfo, fnSendLCIDEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail, fnGenerate),
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
	euaID := testhelpers.RandomEUAID()

	fnAuthorize := func(context.Context) (bool, error) { return true, nil }
	fnFetch := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			ID:        id,
			EUAUserID: null.StringFrom(euaID),
		}, nil
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
			EuaUserID:  euaID,
		}, nil
	}
	reviewEmailCount := 0
	feedbackForEmailText := ""
	fnSendRejectRequestEmail := func(ctx context.Context, recipientAddress models.EmailAddress, reason string, nextSteps string, feedback string) error {
		feedbackForEmailText = feedback
		reviewEmailCount++
		return nil
	}
	fnSendIntakeInvalidEUAIDEmail := func(_ context.Context, _ string, _ string, _ uuid.UUID) error {
		return nil
	}
	fnSendIntakeNoEUAIDEmail := func(_ context.Context, _ string, _ uuid.UUID) error {
		return nil
	}
	cfg := Config{clock: clock.NewMock()}
	happy := NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail)

	s.Run("happy path", func() {
		intake, err := happy(context.Background(), input, action)
		s.NoError(err)
		s.Equal(intake.DecisionNextSteps, nextSteps)
		s.Equal(intake.RejectionReason, reason)
		s.Equal(1, reviewEmailCount)
		s.Equal("Feedback", feedbackForEmailText)
	})

	// test cases for invalid or missing EUA ID

	s.Run("should send notification of invalid EUA ID when fetchUserInfo returns empty data from CEDAR LDAP", func() {
		fetchEmptyUserInfo := func(context.Context, string) (*models.UserInfo, error) {
			return nil, &apperrors.InvalidEUAIDError{
				EUAID: euaID,
			}
		}

		emailSentForInvalidEUAID := false
		sendIntakeInvalidEUAIDEmailMock := func(ctx context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
			emailSentForInvalidEUAID = true
			return nil
		}

		updateRejectionFields := NewUpdateRejectionFields(
			cfg,
			fnAuthorize,
			fnFetch,
			fnUpdate,
			fnSaveAction,
			fetchEmptyUserInfo,
			fnSendRejectRequestEmail,
			sendIntakeInvalidEUAIDEmailMock,
			fnSendIntakeNoEUAIDEmail,
		)
		_, err := updateRejectionFields(context.Background(), input, action)
		s.NoError(err)
		s.True(emailSentForInvalidEUAID)
	})

	s.Run("should send notification of empty EUA ID when intake has no associated EUA ID", func() {
		fetchIntakeWithoutEUAID := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID: id,
			}, nil
		}

		emailSentForNoEUAID := false
		sendIntakeForNoEUAIDEmailMock := func(ctx context.Context, projectName string, intakeID uuid.UUID) error {
			emailSentForNoEUAID = true
			return nil
		}

		updateRejectionFields := NewUpdateRejectionFields(
			cfg,
			fnAuthorize,
			fetchIntakeWithoutEUAID,
			fnUpdate,
			fnSaveAction,
			fnFetchUserInfo,
			fnSendRejectRequestEmail,
			fnSendIntakeInvalidEUAIDEmail,
			sendIntakeForNoEUAIDEmailMock,
		)
		_, err := updateRejectionFields(context.Background(), input, action)
		s.NoError(err)
		s.True(emailSentForNoEUAID)
	})

	// build the error-generating pieces
	fnFetchReturnsNoEUAID := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			ID:        id,
			EUAUserID: null.StringFrom(""),
		}, nil
	}

	fnFetchUserInfoReturnsInvalidEUAID := func(c context.Context, euaID string) (*models.UserInfo, error) {
		return nil, &apperrors.InvalidEUAIDError{
			EUAID: euaID,
		}
	}

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
	fnSendIntakeInvalidEUAIDEmailErr := func(_ context.Context, _ string, _ string, _ uuid.UUID) error {
		return errors.New("send intake invalid EUA ID email error")
	}
	fnSendIntakeNoEUAIDEmailErr := func(_ context.Context, _ string, _ uuid.UUID) error {
		return errors.New("send intake no EUA ID email error")
	}

	// build the table-driven test of error cases for unhappy path
	testCases := map[string]struct {
		fn func(context.Context, *models.SystemIntake, *models.Action) (*models.SystemIntake, error)
	}{
		"error path fetch": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetchErr, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path auth": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorizeErr, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path auth fail": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorizeFail, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path update": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdateErr, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path fetch user info": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfoErr, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path save action": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveActionErr, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path send email": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmailErr, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmail),
		},
		"error path send invalid EUA ID email": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnSaveAction, fnFetchUserInfoReturnsInvalidEUAID, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmailErr, fnSendIntakeNoEUAIDEmail),
		},
		"error path send no EUA ID email": {
			fn: NewUpdateRejectionFields(cfg, fnAuthorize, fnFetchReturnsNoEUAID, fnUpdate, fnSaveAction, fnFetchUserInfo, fnSendRejectRequestEmail, fnSendIntakeInvalidEUAIDEmail, fnSendIntakeNoEUAIDEmailErr),
		},
	}

	for expectedErr, tc := range testCases {
		s.Run(expectedErr, func() {
			_, err := tc.fn(context.Background(), input, action)
			s.Error(err)
		})
	}
}

func (s ServicesTestSuite) TestProvideGRTFeedback() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	s.Run("should send notification of invalid EUA ID when fetchUserInfo returns empty data from CEDAR LDAP", func() {
		fetchIntake := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID:        id,
				EUAUserID: null.StringFrom("ABCD"),
			}, nil
		}

		updateIntake := func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return intake, nil
		}

		saveAction := func(c context.Context, action *models.Action) error {
			return nil
		}

		saveGRTFeedback := func(c context.Context, feedback *models.GRTFeedback) (*models.GRTFeedback, error) {
			return feedback, nil
		}

		fetchEmptyUserInfo := func(c context.Context, euaID string) (*models.UserInfo, error) {
			return nil, &apperrors.InvalidEUAIDError{
				EUAID: euaID,
			}
		}

		sendReviewEmail := func(c context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error {
			return nil
		}

		emailSentForInvalidEUAID := false
		sendIntakeInvalidEUAIDEmailMock := func(c context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
			emailSentForInvalidEUAID = true
			return nil
		}

		sendIntakeNoEUAIDEmail := func(c context.Context, projectName string, intakeID uuid.UUID) error {
			return nil
		}

		provideGRTFeedback := NewProvideGRTFeedback(
			serviceConfig,
			fetchIntake,
			updateIntake,
			saveAction,
			saveGRTFeedback,
			fetchEmptyUserInfo,
			sendReviewEmail,
			sendIntakeInvalidEUAIDEmailMock,
			sendIntakeNoEUAIDEmail,
		)

		_, err := provideGRTFeedback(ctx, &models.GRTFeedback{}, &models.Action{}, models.SystemIntakeStatusAPPROVED, true)
		s.NoError(err)
		s.True(emailSentForInvalidEUAID)
	})

	s.Run("should *not* send notification of invalid EUA ID when fetchUserInfo returns empty data from CEDAR LDAP, but shouldSendEmail is set to false", func() {
		fetchIntake := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID:        id,
				EUAUserID: null.StringFrom("ABCD"),
			}, nil
		}

		updateIntake := func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return intake, nil
		}

		saveAction := func(c context.Context, action *models.Action) error {
			return nil
		}

		saveGRTFeedback := func(c context.Context, feedback *models.GRTFeedback) (*models.GRTFeedback, error) {
			return feedback, nil
		}

		fetchEmptyUserInfo := func(c context.Context, euaID string) (*models.UserInfo, error) {
			return nil, &apperrors.InvalidEUAIDError{
				EUAID: euaID,
			}
		}

		sendReviewEmail := func(c context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error {
			return nil
		}

		emailSentForInvalidEUAID := false
		sendIntakeInvalidEUAIDEmailMock := func(c context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
			emailSentForInvalidEUAID = true
			return nil
		}

		sendIntakeNoEUAIDEmail := func(c context.Context, projectName string, intakeID uuid.UUID) error {
			return nil
		}

		provideGRTFeedback := NewProvideGRTFeedback(
			serviceConfig,
			fetchIntake,
			updateIntake,
			saveAction,
			saveGRTFeedback,
			fetchEmptyUserInfo,
			sendReviewEmail,
			sendIntakeInvalidEUAIDEmailMock,
			sendIntakeNoEUAIDEmail,
		)

		_, err := provideGRTFeedback(ctx, &models.GRTFeedback{}, &models.Action{}, models.SystemIntakeStatusAPPROVED, false)
		s.NoError(err)
		s.False(emailSentForInvalidEUAID)
	})

	s.Run("should send notification of empty EUA ID when intake has no associated EUA ID", func() {
		fetchIntake := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID:        id,
				EUAUserID: null.StringFrom(""),
			}, nil
		}

		updateIntake := func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return intake, nil
		}

		saveAction := func(c context.Context, action *models.Action) error {
			return nil
		}

		saveGRTFeedback := func(c context.Context, feedback *models.GRTFeedback) (*models.GRTFeedback, error) {
			return feedback, nil
		}

		fetchEmptyUserInfo := func(c context.Context, euaID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}

		sendReviewEmail := func(c context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error {
			return nil
		}

		sendIntakeInvalidEUAIDEmail := func(c context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
			return nil
		}

		emailSentForNoEUAID := false
		sendIntakeNoEUAIDEmailMock := func(ctx context.Context, projectName string, intakeID uuid.UUID) error {
			emailSentForNoEUAID = true
			return nil
		}

		provideGRTFeedback := NewProvideGRTFeedback(
			serviceConfig,
			fetchIntake,
			updateIntake,
			saveAction,
			saveGRTFeedback,
			fetchEmptyUserInfo,
			sendReviewEmail,
			sendIntakeInvalidEUAIDEmail,
			sendIntakeNoEUAIDEmailMock,
		)

		_, err := provideGRTFeedback(ctx, &models.GRTFeedback{}, &models.Action{}, models.SystemIntakeStatusAPPROVED, true)
		s.NoError(err)
		s.True(emailSentForNoEUAID)
	})

	s.Run("should *not* send notification of empty EUA ID when intake has no associated EUA ID, but shouldSendEmail is set to false", func() {
		fetchIntake := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID:        id,
				EUAUserID: null.StringFrom(""),
			}, nil
		}

		updateIntake := func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return intake, nil
		}

		saveAction := func(c context.Context, action *models.Action) error {
			return nil
		}

		saveGRTFeedback := func(c context.Context, feedback *models.GRTFeedback) (*models.GRTFeedback, error) {
			return feedback, nil
		}

		fetchEmptyUserInfo := func(c context.Context, euaID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}

		sendReviewEmail := func(c context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error {
			return nil
		}

		sendIntakeInvalidEUAIDEmail := func(c context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
			return nil
		}

		emailSentForNoEUAID := false
		sendIntakeNoEUAIDEmailMock := func(ctx context.Context, projectName string, intakeID uuid.UUID) error {
			emailSentForNoEUAID = true
			return nil
		}

		provideGRTFeedback := NewProvideGRTFeedback(
			serviceConfig,
			fetchIntake,
			updateIntake,
			saveAction,
			saveGRTFeedback,
			fetchEmptyUserInfo,
			sendReviewEmail,
			sendIntakeInvalidEUAIDEmail,
			sendIntakeNoEUAIDEmailMock,
		)

		_, err := provideGRTFeedback(ctx, &models.GRTFeedback{}, &models.Action{}, models.SystemIntakeStatusAPPROVED, true)
		s.NoError(err)
		s.True(emailSentForNoEUAID)
	})
}
