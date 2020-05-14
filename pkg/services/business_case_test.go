package services

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
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

	s.Run("returns query error when save fails", func() {
		fetch := func(id uuid.UUID) (*models.BusinessCase, error) {
			return &models.BusinessCase{}, errors.New("save failed")
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
