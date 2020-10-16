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
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestSystemIntakesByEuaIDFetcher() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	authorize := func(context context.Context, euaID string) (bool, error) { return true, nil }

	s.Run("successfully fetches System Intakes by EUA ID without an error", func() {
		fetch := func(ctx context.Context, euaID string) (models.SystemIntakes, error) {
			return models.SystemIntakes{
				models.SystemIntake{
					EUAUserID: fakeEuaID,
				},
			}, nil
		}
		fetchSystemIntakesByEuaID := NewFetchSystemIntakesByEuaID(serviceConfig, fetch, authorize)
		intakes, err := fetchSystemIntakesByEuaID(context.Background(), fakeEuaID)
		s.NoError(err)
		s.Equal(fakeEuaID, intakes[0].EUAUserID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(ctx context.Context, euaID string) (models.SystemIntakes, error) {
			return models.SystemIntakes{}, errors.New("fetch failed")
		}
		fetchSystemIntakesByEuaID := NewFetchSystemIntakesByEuaID(serviceConfig, fetch, authorize)
		intakes, err := fetchSystemIntakesByEuaID(context.Background(), "FAKE")

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(models.SystemIntakes{}, intakes)
	})
}

func (s ServicesTestSuite) TestNewCreateSystemIntake() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"
	requester := "Test Requester"
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	ctx := context.Background()
	ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: fakeEuaID, JobCodeEASi: true})

	s.Run("successfully creates a system intake without an error", func() {
		create := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				EUAUserID: intake.EUAUserID,
				Requester: requester,
				Status:    models.SystemIntakeStatusDRAFT,
			}, nil
		}
		createIntake := NewCreateSystemIntake(serviceConfig, create)
		intake, err := createIntake(ctx, &models.SystemIntake{
			Requester: requester,
			Status:    models.SystemIntakeStatusDRAFT,
		})
		s.NoError(err)
		s.Equal(fakeEuaID, intake.EUAUserID)
	})

	s.Run("returns query error when create fails", func() {
		create := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("creation failed")
		}
		createIntake := NewCreateSystemIntake(serviceConfig, create)
		intake, err := createIntake(ctx, &models.SystemIntake{
			Requester: requester,
			Status:    models.SystemIntakeStatusDRAFT,
		})
		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestAuthorizeUserIsIntakeRequester() {
	authorizeSaveSystemIntake := NewAuthorizeUserIsIntakeRequester()

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()

		ok, err := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.IsType(&apperrors.ContextError{}, err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestNewUpdateSystemIntake() {
	logger := zap.NewNop()
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			Status: models.SystemIntakeStatusDRAFT,
		}, nil
	}

	fetchSubmitted := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			Status: models.SystemIntakeStatusSUBMITTED,
		}, nil
	}

	requester := "Test Requester"
	save := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			EUAUserID: intake.EUAUserID,
			Requester: requester,
			Status:    intake.Status,
			AlfabetID: intake.AlfabetID,
		}, nil
	}
	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}
	fetchUserInfo := func(logger2 *zap.Logger, euaID string) (*models.UserInfo, error) {
		return &models.UserInfo{Email: "name@site.com"}, nil
	}
	reviewEmailCount := 0
	sendReviewEmail := func(emailText string, recipientAddress string) error {
		reviewEmailCount++
		return nil
	}
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	updateDraftIntake := func(ctx context.Context, existing *models.SystemIntake, incoming *models.SystemIntake) (*models.SystemIntake, error) {
		return incoming, nil
	}

	s.Run("returns no error when successful on update draft", func() {
		ctx := context.Background()
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetch, authorize, fetchUserInfo, sendReviewEmail, updateDraftIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: requester,
		})

		s.NoError(err)
		s.Equal(requester, intake.Requester)
	})

	s.Run("returns query error when fetch fails", func() {
		ctx := context.Background()
		failFetch := func(ctx context.Context, uuid uuid.UUID) (*models.SystemIntake, error) {
			return nil, errors.New("failed to fetch system intake")
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, failFetch, authorize, fetchUserInfo, sendReviewEmail, updateDraftIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{})

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error from update draft", func() {
		ctx := context.Background()
		updateDraftError := errors.New("error")
		failUpdateDraft := func(ctx context.Context, existingUpdate *models.SystemIntake, updatingIntake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, updateDraftError
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetch, authorize, fetchUserInfo, sendReviewEmail, failUpdateDraft, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{
			Status: models.SystemIntakeStatusDRAFT,
		})
		s.Equal(updateDraftError, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error when authorization errors", func() {
		ctx := context.Background()
		err := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, err
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, failAuthorize, fetchUserInfo, sendReviewEmail, updateDraftIntake, true)

		intake, actualError := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.Error(err)
		s.Equal(err, actualError)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns unauthorized error when authorization not ok", func() {
		ctx := context.Background()
		notOKAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, notOKAuthorize, fetchUserInfo, sendReviewEmail, updateDraftIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.UnauthorizedError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error from fetching requester email", func() {
		ctx := context.Background()
		failFetchEmailAddress := func(logger *zap.Logger, euaID string) (*models.UserInfo, error) {
			return nil, &apperrors.ExternalAPIError{
				Err:       errors.New("sample error"),
				Model:     models.UserInfo{},
				ModelID:   euaID,
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, failFetchEmailAddress, sendReviewEmail, updateDraftIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, reviewEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns ExternalAPIError if requester email not returned", func() {
		ctx := context.Background()
		failFetchUserInfo := func(logger *zap.Logger, euaID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, failFetchUserInfo, sendReviewEmail, updateDraftIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, reviewEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns notification error when review email fails", func() {
		ctx := context.Background()
		failSendReviewEmail := func(emailText string, recipientAddress string) error {
			return &apperrors.NotificationError{
				Err:             errors.New("failed to send Email"),
				DestinationType: apperrors.DestinationTypeEmail,
			}
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, fetchUserInfo, failSendReviewEmail, updateDraftIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.NotificationError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns resource conflict error when making unauthorized status change", func() {
		ctx := context.Background()
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, fetchUserInfo, sendReviewEmail, updateDraftIntake, true)

		// In this case, saving a DRAFT intake against an existing SUBMITTED intake
		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusDRAFT})

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestNewUpdateDraftSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	existing := models.SystemIntake{Requester: "existing"}
	incoming := models.SystemIntake{Requester: "incoming"}
	s.Run("golden path update draft intake", func() {
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, authorize, update)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.NoError(err)
		s.Equal(&incoming, intake)
	})

	s.Run("returns error from authorization if authorization fails", func() {
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, failAuthorize, update)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.Equal(authorizationError, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, unauthorize, update)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.UnauthorizedError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns query error if update fails", func() {
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, authorize, failUpdate)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestSystemIntakeByIDFetcher() {
	logger := zap.NewNop()
	fakeID := uuid.New()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	authorize := func(context context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }

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
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestAuthorizeArchiveSystemIntake() {
	logger := zap.NewNop()
	authorizeArchiveSystemIntake := NewAuthorizeArchiveSystemIntake(logger)

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()

		ok, err := authorizeArchiveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.IsType(&apperrors.ContextError{}, err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeArchiveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeArchiveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
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
	sendWithdrawEmail := func(requestName string) error {
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

func (s ServicesTestSuite) TestAuthorizeRequireGRTJobCode() {
	fnAuth := NewAuthorizeRequireGRTJobCode()
	nonGRT := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: false}
	yesGRT := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: true}

	testCases := map[string]struct {
		ctx     context.Context
		allowed bool
	}{
		"anonymous": {
			ctx:     context.Background(),
			allowed: false,
		},
		"non grt": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonGRT),
			allowed: false,
		},
		"has grt": {
			ctx:     appcontext.WithPrincipal(context.Background(), &yesGRT),
			allowed: true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			ok, err := fnAuth(tc.ctx, nil)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}

func (s ServicesTestSuite) TestUpdateLifecycleFields() {
	today := time.Now()
	input := &models.SystemIntake{
		ID:                 uuid.New(),
		LifecycleID:        null.StringFrom("010010"),
		LifecycleExpiresAt: &today,
		LifecycleNextSteps: null.StringFrom(fmt.Sprintf("next %s", today)),
		LifecycleScope:     null.StringFrom(fmt.Sprintf("scope %s", today)),
	}

	fnAuthorize := func(context.Context, *models.SystemIntake) (bool, error) { return true, nil }
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
		if !i.LifecycleNextSteps.Equal(input.LifecycleNextSteps) {
			return nil, errors.New("incorrect next")
		}
		if !i.LifecycleScope.Equal(input.LifecycleScope) {
			return nil, errors.New("incorrect scope")
		}
		return i, nil
	}
	fnGenerate := func(context.Context) (string, error) { return "993659", nil }
	cfg := Config{clock: clock.NewMock()}
	happy := NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnGenerate)

	s.Run("happy path provided lcid", func() {
		err := happy(context.Background(), input)
		s.NoError(err)
	})

	// from here on out, we always expect the LCID to get generated
	input.LifecycleID = null.StringFrom("")

	s.Run("happy path generates lcid", func() {
		err := happy(context.Background(), input)
		s.NoError(err)
	})

	// build the error-generating pieces
	fnAuthorizeErr := func(context.Context, *models.SystemIntake) (bool, error) { return false, errors.New("auth error") }
	fnAuthorizeFail := func(context.Context, *models.SystemIntake) (bool, error) { return false, nil }
	fnFetchErr := func(c context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return nil, errors.New("fetch error")
	}
	fnUpdateErr := func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
		return nil, errors.New("update error")
	}
	fnGenerateErr := func(context.Context) (string, error) { return "", errors.New("gen error") }

	// build the table-driven test of error cases for unhappy path
	testCases := map[string]struct {
		fn func(context.Context, *models.SystemIntake) error
	}{
		"error path fetch": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetchErr, fnUpdate, fnGenerate),
		},
		"error path auth": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorizeErr, fnFetch, fnUpdate, fnGenerate),
		},
		"error path auth fail": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorizeFail, fnFetch, fnUpdate, fnGenerate),
		},
		"error path generate": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdate, fnGenerateErr),
		},
		"error path update": {
			fn: NewUpdateLifecycleFields(cfg, fnAuthorize, fnFetch, fnUpdateErr, fnGenerate),
		},
	}

	for expectedErr, tc := range testCases {
		s.Run(expectedErr, func() {
			err := tc.fn(context.Background(), input)
			s.Error(err)
		})
	}
}
