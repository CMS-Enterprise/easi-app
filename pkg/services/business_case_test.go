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

func (s ServicesTestSuite) TestAuthorizeCreateBusinessCase() {
	logger := zap.NewNop()
	authorizeCreateBusinessCase := NewAuthorizeCreateBusinessCase(logger)

	s.Run("No EUA ID fails auth", func() {
		ok, err := authorizeCreateBusinessCase(&models.BusinessCase{}, &models.SystemIntake{})

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		businessCase := models.BusinessCase{
			EUAUserID: "ZYXW",
		}
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeCreateBusinessCase(&businessCase, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		businessCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeCreateBusinessCase(&businessCase, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestBusinessCaseCreator() {
	logger := zap.NewNop()
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
	authorize := func(businessCase *models.BusinessCase, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}

	s.Run("successfully creates a Business Case without an error", func() {
		createBusinessCase := NewCreateBusinessCase(fetch, authorize, create, logger)
		businessCase, err := createBusinessCase(&input)
		s.NoError(err)

		s.Equal(euaID, businessCase.EUAUserID)
	})

	s.Run("returns query error when create fails", func() {
		create = func(businessCase *models.BusinessCase) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("creation failed")
		}
		createBusinessCase := NewCreateBusinessCase(fetch, authorize, create, logger)
		businessCase, err := createBusinessCase(&input)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})

	s.Run("returns validation error when lifecycle cost phases are duplicated", func() {
		input.LifecycleCostLines = models.EstimatedLifecycleCosts{
			testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
			testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
		}
		createBusinessCase := NewCreateBusinessCase(fetch, authorize, create, logger)
		businessCase, err := createBusinessCase(&input)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(&models.BusinessCase{}, businessCase)
	})
}
