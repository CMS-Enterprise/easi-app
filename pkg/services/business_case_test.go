package services

import (
	"context"
	"errors"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *ServicesTestSuite) TestBusinessCaseByIDFetcher() {
	fakeID := uuid.New()
	authorized := func(context context.Context) bool { return true }

	s.Run("successfully fetches Business Case by ID without an error", func() {
		fetch := func(ctx context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{
				BusinessCase: models.BusinessCase{
					ID: fakeID,
				},
			}, nil
		}
		fetchBusinessCaseByID := NewFetchBusinessCaseByID(fetch, authorized)
		businessCase, err := fetchBusinessCaseByID(context.Background(), fakeID)
		s.NoError(err)

		s.Equal(fakeID, businessCase.ID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(ctx context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{}, errors.New("fetch failed")
		}
		fetchBusinessCaseByID := NewFetchBusinessCaseByID(fetch, authorized)

		businessCase, err := fetchBusinessCaseByID(context.Background(), uuid.New())

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCaseWithCosts{}, businessCase)
	})
}

func (s *ServicesTestSuite) TestBusinessCaseCreator() {
	ctx := context.Background()
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	euaID := testhelpers.RandomEUAIDNull()
	intake := &models.SystemIntake{
		EUAUserID:        euaID,
		RequestType:      models.SystemIntakeRequestTypeNEW,
		RequestFormState: models.SIRFSSubmitted,
		Step:             models.SystemIntakeStepDRAFTBIZCASE,
	}
	intake, err := s.store.CreateSystemIntake(ctx, intake)
	s.NoError(err)

	input := models.BusinessCaseWithCosts{
		BusinessCase: models.BusinessCase{
			EUAUserID:      euaID.ValueOrZero(),
			SystemIntakeID: intake.ID,
		},
	}
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return intake, nil
	}
	create := func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
		return &models.BusinessCaseWithCosts{
			BusinessCase: models.BusinessCase{
				EUAUserID: euaID.ValueOrZero(),
			},
		}, nil
	}
	authorized := func(ctx context.Context, intake *models.SystemIntake) bool {
		return true
	}
	createAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
		return action, nil
	}
	fetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			DisplayName: "Name",
			Email:       "name@site.com",
			Username:    testhelpers.RandomEUAID(),
		}, nil
	}
	updateIntake := func(_ context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}

	s.Run("successfully creates a Business Case without an error", func() {
		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorized, createAction, fetchUserInfo, create, updateIntake)
		businessCase, err := createBusinessCase(ctx, &input)
		s.NoError(err)

		s.Equal(euaID.ValueOrZero(), businessCase.EUAUserID)
	})

	s.Run("returns query error when create fails", func() {
		failCreate := func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{}, errors.New("creation failed")
		}
		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorized, createAction, fetchUserInfo, failCreate, updateIntake)
		businessCase, err := createBusinessCase(ctx, &input)

		s.Error(err)
		s.Equal(&models.BusinessCaseWithCosts{}, businessCase)
	})

	s.Run("autofills information from the intake", func() {
		create = func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{
				BusinessCase: models.BusinessCase{
					Requester:     businessCase.Requester,
					BusinessOwner: businessCase.BusinessOwner,
					ProjectName:   businessCase.ProjectName,
					BusinessNeed:  businessCase.BusinessNeed,
				},
			}, nil
		}
		intake.Requester = "Charlie Chaplin"
		intake.BusinessOwner = null.StringFrom("Aretha Franklin")
		intake.ProjectName = null.StringFrom("Sitting on the dock of the bay")
		intake.BusinessNeed = null.StringFrom("To be or not to be, that is the question")
		_, err := s.store.UpdateSystemIntake(ctx, intake)
		s.NoError(err)

		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorized, createAction, fetchUserInfo, create, updateIntake)

		businessCase, err := createBusinessCase(ctx, &input)
		s.NoError(err)
		s.Equal(intake.Requester, businessCase.Requester.String)
		s.Equal(intake.BusinessOwner, businessCase.BusinessOwner)
		s.Equal(intake.ProjectName, businessCase.ProjectName)
		s.Equal(intake.BusinessNeed, businessCase.BusinessNeed)
	})

	s.Run("returns error if createAction fails", func() {
		failCreateAction := func(ctx context.Context, action *models.Action) (*models.Action, error) {
			return nil, errors.New("error")
		}

		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorized, failCreateAction, fetchUserInfo, create, updateIntake)
		businessCase, err := createBusinessCase(ctx, &input)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCaseWithCosts{}, businessCase)
	})

	s.Run("returns error if fails to fetch user info", func() {
		fetchUserInfoError := errors.New("error")
		failFetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
			return nil, fetchUserInfoError
		}
		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorized, createAction, failFetchUserInfo, create, updateIntake)
		businessCase, err := createBusinessCase(ctx, &input)
		s.Equal(fetchUserInfoError, err)
		s.Equal(&models.BusinessCaseWithCosts{}, businessCase)
	})

	s.Run("returns error if fetches bad user info", func() {
		failFetchUserInfo := func(_ context.Context, EUAUserID string) (*models.UserInfo, error) {
			return &models.UserInfo{}, nil
		}
		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorized, createAction, failFetchUserInfo, create, updateIntake)
		businessCase, err := createBusinessCase(ctx, &input)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(&models.BusinessCaseWithCosts{}, businessCase)
	})

	// Uncomment below when UI has changed for unique lifecycle costs
	//s.Run("returns validation error when lifecycle cost phases are duplicated", func() {
	//	input.LifecycleCostLines = models.EstimatedLifecycleCosts{
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//	}
	//	createBusinessCase := NewCreateBusinessCase(fetch, authorized, create, logger, mockClock)
	//	businessCase, err := createBusinessCase(ctx, &input)
	//
	//	s.IsType(&apperrors.ValidationError{}, err)
	//	s.Equal(&models.BusinessCase{}, businessCase)
	//})
}

func (s *ServicesTestSuite) TestBusinessCaseUpdater() {
	ctx := context.Background()
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	euaID := testhelpers.RandomEUAIDNull()
	intake := &models.SystemIntake{
		EUAUserID:        euaID,
		RequestType:      models.SystemIntakeRequestTypeNEW,
		RequestFormState: models.SIRFSSubmitted,
	}
	retIntake, err := s.store.CreateSystemIntake(ctx, intake)
	s.NoError(err)

	existingBusinessCase := testhelpers.NewBusinessCase(retIntake.ID)

	fetch := func(ctx context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
		return &existingBusinessCase, nil
	}
	update := func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
		return businessCase, nil
	}
	authorized := func(ctx context.Context, businessCase *models.BusinessCase) bool {
		return true
	}

	s.Run("successfully updates a Business Case without an error", func() {

		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorized, update, s.store.FetchSystemIntakeByID, s.store.UpdateSystemIntake)

		businessCase, err := updateBusinessCase(ctx, &existingBusinessCase)

		s.NoError(err)
		s.Equal(existingBusinessCase, *businessCase)
	})

	s.Run("returns query error when update fails", func() {
		failUpdate := func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
			return &models.BusinessCaseWithCosts{}, errors.New("creation failed")
		}
		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorized, failUpdate, s.store.FetchSystemIntakeByID, s.store.UpdateSystemIntake)
		businessCase, err := updateBusinessCase(ctx, &existingBusinessCase)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCaseWithCosts{}, businessCase)
	})

	// Uncomment below when UI has changed for unique lifecycle costs
	//s.Run("returns validation error when lifecycle cost phases are duplicated", func() {
	//	existingBusinessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//	}
	//	updateBusinessCase := NewUpdateBusinessCase(fetch, authorized, update, logger, mockClock)
	//	businessCase, err := updateBusinessCase(ctx, &existingBusinessCase)
	//
	//	s.IsType(&apperrors.ValidationError{}, err)
	//	s.Equal(&models.BusinessCase{}, businessCase)
	//})
}
