package services

import (
	"context"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// FetchSystemIntakesByEuaID fetches all system intakes by a given user
func FetchSystemIntakesByEuaID(euaID string, db *sqlx.DB) (models.SystemIntakes, error) {
	var intakes []models.SystemIntake
	err := db.Select(&intakes, "SELECT * FROM system_intake WHERE eua_user_id=$1", euaID)
	if err != nil {
		return models.SystemIntakes{}, err
	}
	return intakes, nil
}

// NewSaveSystemIntake is a service to save the system intake
func NewSaveSystemIntake(
	save func(intake *models.SystemIntake) error,
	authorize func(context context.Context) (bool, error),
	logger *zap.Logger,
) func(context context.Context, intake *models.SystemIntake) error {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		ok, err := authorize(ctx)
		if err != nil {
			logger.Error("failed to authorize system intake save")
			return err
		}
		if !ok {
			logger.Info("unauthorized access to save system intake")
			return &apperrors.UnauthorizedError{Err: err}
		}
		err = save(intake)
		if err != nil {
			logger.Error("failed to save system intake")
			return &apperrors.QueryError{
				Err:       err,
				Model:     "system intake",
				Operation: "save",
			}
		}
		return nil
	}
}
