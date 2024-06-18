package services

import (
	"context"
	"errors"

	"github.com/guregu/null"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ServicesTestSuite) TestFetchSystemIntakes() {
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

	testCases := map[string]struct {
		ctx  context.Context
		fn   func(context.Context) (models.SystemIntakes, error)
		fail bool
	}{
		"happy path requester": {
			appcontext.WithPrincipal(context.Background(), requester),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAllFail, fnAuth),
			false,
		},
		"happy path reviewer fetch all": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByIDFail, fnAll, fnAuth),
			false,
		},
		"fail authorization": {
			context.Background(),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAll, fnAuth),
			true,
		},
		"fail requester data access": {
			appcontext.WithPrincipal(context.Background(), requester),
			NewFetchSystemIntakes(serviceConfig, fnByIDFail, fnAll, fnAuth),
			true,
		},
		"fail reviewer fetch all data access": {
			appcontext.WithPrincipal(context.Background(), reviewer),
			NewFetchSystemIntakes(serviceConfig, fnByID, fnAllFail, fnAuth),
			true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			intakes, err := tc.fn(tc.ctx)

			if tc.fail {
				s.Error(err)
				return
			}
			s.NoError(err)
			s.GreaterOrEqual(len(intakes), 1)
		})
	}
}

func (s *ServicesTestSuite) TestNewUpdateSystemIntake() {
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

func (s *ServicesTestSuite) TestSystemIntakeByIDFetcher() {
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

func (s *ServicesTestSuite) TestSystemIntakeArchiver() {
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
	sendWithdrawEmail := func(_ context.Context, _ string) error {
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
