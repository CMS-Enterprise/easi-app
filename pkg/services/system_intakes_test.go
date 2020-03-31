package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestSystemIntakesByUserFetcher() {
	if viper.Get("ENVIRONMENT") == "LOCAL" {
		s.Run("successfully fetches System Intakes", func() {
			tx := s.db.MustBegin()
			// Todo is this the best way to generate a random string?
			fakeEuaID := uuid.New().String()
			_, err := tx.NamedExec("INSERT INTO system_intake (id, eua_user_id) VALUES (:id, :eua_user_id)", &models.SystemIntake{ID: uuid.New(), EUAUserID: fakeEuaID})
			s.NoError(err)
			err = tx.Commit()
			s.NoError(err)

			systemIntakes, err := FetchSystemIntakesByEuaID(fakeEuaID, s.db)
			s.NoError(err)
			s.Len(systemIntakes, 1)
		})
	}
}

func (s ServicesTestSuite) TestAuthorizeSaveSystemIntake() {
	logger := zap.NewNop()
	authorizeSaveSystemIntake := NewAuthorizeSaveSystemIntake(logger)

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()

		ok, err := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.IsType(&apperrors.ContextError{}, err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithEuaID(ctx, "ZYXW")
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithEuaID(ctx, "ABCD")
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestNewSaveSystemIntake() {
	logger := zap.NewNop()
	save := func(intake *models.SystemIntake) error {
		return nil
	}
	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}

	s.Run("returns no error when successful", func() {
		ctx := context.Background()
		saveSystemIntake := NewSaveSystemIntake(save, authorize, logger)

		err := saveSystemIntake(ctx, &models.SystemIntake{})

		s.NoError(err)
	})

	s.Run("returns query error when save fails", func() {
		ctx := context.Background()
		save = func(intake *models.SystemIntake) error {
			return errors.New("save failed")
		}
		saveSystemIntake := NewSaveSystemIntake(save, authorize, logger)

		err := saveSystemIntake(ctx, &models.SystemIntake{})

		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error when authorization errors", func() {
		ctx := context.Background()
		err := errors.New("authorization failed")
		authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, err
		}
		saveSystemIntake := NewSaveSystemIntake(save, authorize, logger)

		actualError := saveSystemIntake(ctx, &models.SystemIntake{})

		s.Error(err)
		s.Equal(err, actualError)
	})

	s.Run("returns unauthorized error when authorization not ok", func() {
		ctx := context.Background()
		authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		saveSystemIntake := NewSaveSystemIntake(save, authorize, logger)

		err := saveSystemIntake(ctx, &models.SystemIntake{})

		s.IsType(&apperrors.UnauthorizedError{}, err)
	})
}

func (s ServicesTestSuite) TestSystemIntakeByIDFetcher() {
	logger := zap.NewNop()
	fakeID := uuid.New()

	s.Run("successfully fetches System Intake by ID without an error", func() {
		fetch := func(id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID: fakeID,
			}, nil
		}
		fetchSystemIntakeByID := NewFetchSystemIntakeByID(fetch, logger)
		intake, err := fetchSystemIntakeByID(fakeID)
		s.NoError(err)

		s.Equal(fakeID, intake.ID)
	})

	s.Run("returns query error when save fails", func() {
		fetch := func(id uuid.UUID) (*models.SystemIntake, error) {
				return &models.SystemIntake{}, errors.New("save failed")
		}
		fetchSystemIntakeByID := NewFetchSystemIntakeByID(fetch, logger)

		intake, err := fetchSystemIntakeByID(uuid.New())

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}
