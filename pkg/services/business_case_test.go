package services

import (
	"context"
	"errors"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestBusinessCaseByIDFetcher() {
	logger := zap.NewNop()
	fakeID := uuid.New()
	serviceConfig := NewConfig(logger)
	serviceConfig.clock = clock.NewMock()

	s.Run("successfully fetches Business Case by ID without an error", func() {
		fetch := func(id uuid.UUID) (*models.BusinessCase, error) {
			return &models.BusinessCase{
				ID: fakeID,
			}, nil
		}
		fetchBusinessCaseByID := NewFetchBusinessCaseByID(serviceConfig, fetch)
		businessCase, err := fetchBusinessCaseByID(fakeID)
		s.NoError(err)

		s.Equal(fakeID, businessCase.ID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(id uuid.UUID) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("fetch failed")
		}
		fetchBusinessCaseByID := NewFetchBusinessCaseByID(serviceConfig, fetch)

		businessCase, err := fetchBusinessCaseByID(uuid.New())

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})
}

func (s ServicesTestSuite) TestBusinessCasesByEuaIDFetcher() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"
	serviceConfig := NewConfig(logger)
	serviceConfig.clock = clock.NewMock()

	s.Run("successfully fetches Business Cases by EUA ID without an error", func() {
		fetch := func(euaID string) (models.BusinessCases, error) {
			return models.BusinessCases{
				models.BusinessCase{
					EUAUserID: fakeEuaID,
				},
			}, nil
		}
		fetchBusinessCasesByEuaID := NewFetchBusinessCasesByEuaID(serviceConfig, fetch)
		businessCases, err := fetchBusinessCasesByEuaID(fakeEuaID)
		s.NoError(err)
		s.Equal(fakeEuaID, businessCases[0].EUAUserID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(euaID string) (models.BusinessCases, error) {
			return models.BusinessCases{}, errors.New("fetch failed")
		}
		fetchBusinessCasesByEuaID := NewFetchBusinessCasesByEuaID(serviceConfig, fetch)
		businessCases, err := fetchBusinessCasesByEuaID("FAKE")

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(models.BusinessCases{}, businessCases)
	})
}

func (s ServicesTestSuite) TestAuthorizeCreateBusinessCase() {
	logger := zap.NewNop()
	authorizeCreateBusinessCase := NewAuthorizeCreateBusinessCase(logger)

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()
		ok, err := authorizeCreateBusinessCase(ctx, &models.SystemIntake{})

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithUser(ctx, models.User{EUAUserID: "ZYXW"})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeCreateBusinessCase(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithUser(ctx, models.User{EUAUserID: "ABCD"})
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeCreateBusinessCase(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestBusinessCaseCreator() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger)
	serviceConfig.clock = clock.NewMock()
	euaID := testhelpers.RandomEUAID()
	intakeID := uuid.New()
	intake := models.SystemIntake{
		EUAUserID: euaID,
		ID:        intakeID,
		Status:    models.SystemIntakeStatusSUBMITTED,
	}
	err := s.store.SaveSystemIntake(&intake)
	s.NoError(err)

	input := models.BusinessCase{
		EUAUserID:      euaID,
		SystemIntakeID: intakeID,
	}
	fetch := func(id uuid.UUID) (*models.SystemIntake, error) {
		return &intake, nil
	}
	create := func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		return &models.BusinessCase{
			EUAUserID: euaID,
		}, nil
	}
	authorize := func(context context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}
	ctx := context.Background()

	s.Run("successfully creates a Business Case without an error", func() {
		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorize, create)
		businessCase, err := createBusinessCase(ctx, &input)
		s.NoError(err)

		s.Equal(euaID, businessCase.EUAUserID)
	})

	s.Run("returns query error when create fails", func() {
		create = func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("creation failed")
		}
		createBusinessCase := NewCreateBusinessCase(serviceConfig, fetch, authorize, create)
		businessCase, err := createBusinessCase(ctx, &input)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})

	// Uncomment below when UI has changed for unique lifecycle costs
	//s.Run("returns validation error when lifecycle cost phases are duplicated", func() {
	//	input.LifecycleCostLines = models.EstimatedLifecycleCosts{
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//	}
	//	createBusinessCase := NewCreateBusinessCase(fetch, authorize, create, logger, mockClock)
	//	businessCase, err := createBusinessCase(ctx, &input)
	//
	//	s.IsType(&apperrors.ValidationError{}, err)
	//	s.Equal(&models.BusinessCase{}, businessCase)
	//})
}

func (s ServicesTestSuite) TestAuthorizeUpdateBusinessCase() {
	logger := zap.NewNop()
	authorizeUpdateBusinessCase := NewAuthorizeUpdateBusinessCase(logger)

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()
		ok, err := authorizeUpdateBusinessCase(ctx, &models.BusinessCase{})

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithUser(ctx, models.User{EUAUserID: "ZYXW"})

		businessCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeUpdateBusinessCase(ctx, &businessCase)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithUser(ctx, models.User{EUAUserID: "ABCD"})
		businessCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeUpdateBusinessCase(ctx, &businessCase)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestBusinessCaseUpdater() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger)
	serviceConfig.clock = clock.NewMock()
	euaID := testhelpers.RandomEUAID()
	intakeID := uuid.New()
	intake := models.SystemIntake{
		EUAUserID: euaID,
		ID:        intakeID,
		Status:    models.SystemIntakeStatusSUBMITTED,
	}
	err := s.store.SaveSystemIntake(&intake)
	s.NoError(err)

	existingBusinessCase := testhelpers.NewBusinessCase()
	fetch := func(id uuid.UUID) (*models.BusinessCase, error) {
		return &existingBusinessCase, nil
	}
	update := func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		return businessCase, nil
	}
	authorize := func(context context.Context, businessCase *models.BusinessCase) (bool, error) {
		return true, nil
	}
	emailCount := 0
	sendEmail := func(requester string, intakeID uuid.UUID) error {
		emailCount++
		return nil
	}
	ctx := context.Background()

	s.Run("successfully updates a Business Case without an error", func() {
		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorize, update, sendEmail)

		businessCase, err := updateBusinessCase(ctx, &existingBusinessCase)

		s.NoError(err)
		s.Equal(existingBusinessCase, *businessCase)
	})

	s.Run("returns query error when update fails", func() {
		failUpdate := func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("creation failed")
		}
		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorize, failUpdate, sendEmail)
		businessCase, err := updateBusinessCase(ctx, &existingBusinessCase)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})

	// Uncomment below when UI has changed for unique lifecycle costs
	//s.Run("returns validation error when lifecycle cost phases are duplicated", func() {
	//	existingBusinessCase.LifecycleCostLines = models.EstimatedLifecycleCosts{
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//		testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
	//	}
	//	updateBusinessCase := NewUpdateBusinessCase(fetch, authorize, update, logger, mockClock)
	//	businessCase, err := updateBusinessCase(ctx, &existingBusinessCase)
	//
	//	s.IsType(&apperrors.ValidationError{}, err)
	//	s.Equal(&models.BusinessCase{}, businessCase)
	//})

	s.Run("returns error when validation fails", func() {
		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorize, update, sendEmail)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.ID = existingBusinessCase.ID
		businessCase.EUAUserID = existingBusinessCase.EUAUserID
		businessCase.Requester = null.NewString("", false)
		businessCase.Status = models.BusinessCaseStatusSUBMITTED

		_, err := updateBusinessCase(ctx, &businessCase)

		s.IsType(&apperrors.ValidationError{}, err)
	})

	s.Run("doesn't email if existing businessCase was previously submitted", func() {
		earlierBusinessCase := testhelpers.NewBusinessCase()
		earlierBusinessCase.Status = models.BusinessCaseStatusSUBMITTED
		fetchDifferent := func(id uuid.UUID) (*models.BusinessCase, error) {
			return &earlierBusinessCase, nil
		}

		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetchDifferent, authorize, update, sendEmail)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		businessCase.ID = earlierBusinessCase.ID
		businessCase.EUAUserID = earlierBusinessCase.EUAUserID

		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)

		actualBusinessCase, err := updateBusinessCase(ctx, &businessCase)
		s.NoError(err)
		s.Equal(businessCase, *actualBusinessCase)
		s.Equal(0, emailCount)
	})

	s.Run("returns no error when successful on submit", func() {
		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorize, update, sendEmail)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		businessCase.ID = existingBusinessCase.ID
		businessCase.EUAUserID = existingBusinessCase.EUAUserID
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)

		actualBusinessCase, err := updateBusinessCase(ctx, &businessCase)

		s.NoError(err)
		s.Equal(businessCase, *actualBusinessCase)
		s.Equal(1, emailCount)
		s.Equal(serviceConfig.clock.Now(), *actualBusinessCase.SubmittedAt)
	})

	s.Run("returns notification error when email fails", func() {
		failSendEmail := func(requester string, intakeID uuid.UUID) error {
			return &apperrors.NotificationError{
				Err:             errors.New("failed to send Email"),
				DestinationType: apperrors.DestinationTypeEmail,
			}
		}
		updateBusinessCase := NewUpdateBusinessCase(serviceConfig, fetch, authorize, update, failSendEmail)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.Status = models.BusinessCaseStatusSUBMITTED
		businessCase.ID = existingBusinessCase.ID
		businessCase.EUAUserID = existingBusinessCase.EUAUserID
		businessCase.LifecycleCostLines = testhelpers.NewValidLifecycleCosts(&businessCase.ID)

		actualBusinessCase, err := updateBusinessCase(ctx, &businessCase)

		s.IsType(&apperrors.NotificationError{}, err)
		s.Equal(businessCase, *actualBusinessCase)
	})
}
