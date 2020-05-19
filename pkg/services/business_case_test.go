package services

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestBusinessCaseByIDFetcher() {
	logger := zap.NewNop()
	fakeID := uuid.New()

	s.Run("successfully fetches Business Case by ID without an error", func() {
		fetch := func(id uuid.UUID) (*models.BusinessCase, error) {
			return &models.BusinessCase{
				ID: fakeID,
			}, nil
		}
		fetchBusinessCaseByID := NewFetchBusinessCaseByID(fetch, logger)
		businessCase, err := fetchBusinessCaseByID(fakeID)
		s.NoError(err)

		s.Equal(fakeID, businessCase.ID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(id uuid.UUID) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("fetch failed")
		}
		fetchBusinessCaseByID := NewFetchBusinessCaseByID(fetch, logger)

		businessCase, err := fetchBusinessCaseByID(uuid.New())

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})
}

func (s ServicesTestSuite) TestBusinessCasesByEuaIDFetcher() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"

	s.Run("successfully fetches Business Cases by EUA ID without an error", func() {
		fetch := func(euaID string) (models.BusinessCases, error) {
			return models.BusinessCases{
				models.BusinessCase{
					EUAUserID: fakeEuaID,
				},
			}, nil
		}
		fetchBusinessCasesByEuaID := NewFetchBusinessCasesByEuaID(fetch, logger)
		businessCases, err := fetchBusinessCasesByEuaID(fakeEuaID)
		s.NoError(err)
		s.Equal(fakeEuaID, businessCases[0].EUAUserID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(euaID string) (models.BusinessCases, error) {
			return models.BusinessCases{}, errors.New("fetch failed")
		}
		fetchBusinessCasesByEuaID := NewFetchBusinessCasesByEuaID(fetch, logger)
		businessCases, err := fetchBusinessCasesByEuaID("FAKE")

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(models.BusinessCases{}, businessCases)
	})
}

func (s ServicesTestSuite) TestBusinessCaseCreater() {
	logger := zap.NewNop()
	euaID := testhelpers.RandomEUAID()
	input := models.BusinessCase{
		EUAUserID:      euaID,
		SystemIntakeID: uuid.New(),
	}
	create := func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		return &models.BusinessCase{
			EUAUserID: euaID,
		}, nil
	}

	s.Run("successfully creates a Business Case without an error", func() {
		createBusinessCase := NewCreateBusinessCase(create, logger)
		businessCase, err := createBusinessCase(&input)
		s.NoError(err)

		s.Equal(euaID, businessCase.EUAUserID)
	})

	s.Run("returns query error when create fails", func() {
		create = func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("creation failed")
		}
		createBusinessCase := NewCreateBusinessCase(create, logger)
		businessCase, err := createBusinessCase(&input)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})

	s.Run("returns validation error when lifecycle cost phases are duplicated", func() {
		input.LifecycleCostLines = models.EstimatedLifecycleCosts{
			testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
			testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
		}
		createBusinessCase := NewCreateBusinessCase(create, logger)
		businessCase, err := createBusinessCase(&input)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})
}
