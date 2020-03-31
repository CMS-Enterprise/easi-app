package services

import (
	"context"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
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

// NewAuthorizeSaveSystemIntake returns a function
// that authorizes a user for saving a system intake
func NewAuthorizeSaveSystemIntake(logger *zap.Logger) func(
	context context.Context,
	intake *models.SystemIntake,
) (bool, error) {
	return func(context context.Context, intake *models.SystemIntake) (bool, error) {
		euaID, ok := appcontext.EuaID(context)
		if !ok {
			logger.Error("unable to get EUA ID from context")
			return false, &apperrors.ContextError{
				Operation: apperrors.ContextGet,
				Object:    "EUA ID",
			}
		}
		// If intake doesn't exist or owned by user, authorize
		if intake == nil || euaID == intake.EUAUserID {
			logger.With(zap.Bool("Authorized", true)).
				With(zap.String("Operation", "SaveSystemIntake")).
				Info("user authorized to save system intake")
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			With(zap.String("Operation", "SaveSystemIntake")).
			Info("unauthorized attempt to save system intake")
		return false, nil
	}
}

// NewSaveSystemIntake is a service to save the system intake
func NewSaveSystemIntake(
	save func(intake *models.SystemIntake) error,
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	logger *zap.Logger,
) func(context context.Context, intake *models.SystemIntake) error {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		// TODO: need to fetch intake here and pass it to authorization
		ok, err := authorize(ctx, intake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}
		err = save(intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     "SystemIntake",
				Operation: apperrors.QuerySave,
			}
		}
		return nil
	}
}
