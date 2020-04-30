package services

import (
	"context"
	"errors"

	"github.com/guregu/null"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchSystemIntakesByEuaID is a service to fetch system intakes by EUA id
func NewFetchSystemIntakesByEuaID(
	fetch func(euaID string) (models.SystemIntakes, error),
	logger *zap.Logger,
) func(euaID string) (models.SystemIntakes, error) {
	return func(euaID string) (models.SystemIntakes, error) {
		intakes, err := fetch(euaID)
		if err != nil {
			logger.Error("failed to fetch system intakes")
			return models.SystemIntakes{}, &apperrors.QueryError{
				Err:       err,
				Model:     "system intakes",
				Operation: apperrors.QueryFetch,
			}
		}
		return intakes, nil
	}
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
	fetch func(id uuid.UUID) (*models.SystemIntake, error),
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	logger *zap.Logger,
) func(context context.Context, intake *models.SystemIntake) error {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		existingIntake, fetchErr := fetch(intake.ID)
		// TODO: Replace with a method that intentionally decides no result
		if fetchErr != nil && fetchErr.Error() == "sql: no rows in result set" {
			existingIntake = nil
		} else if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     "SystemIntake",
			}
		}
		ok, err := authorize(ctx, existingIntake)
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

// NewFetchSystemIntakeByID is a service to fetch the system intake by intake id
func NewFetchSystemIntakeByID(
	fetch func(id uuid.UUID) (*models.SystemIntake, error),
	logger *zap.Logger,
) func(id uuid.UUID) (*models.SystemIntake, error) {
	return func(id uuid.UUID) (*models.SystemIntake, error) {
		intake, err := fetch(id)
		if err != nil {
			logger.Error("failed to fetch system intake")
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     "system intake",
				Operation: apperrors.QueryFetch,
			}
		}
		return intake, nil
	}
}

// NewSubmitSystemIntake is a service to submit system intake to CEDAR
func NewSubmitSystemIntake(
	submit func(intake *models.SystemIntake, logger *zap.Logger) (string, error),
	save func(intake *models.SystemIntake) error,
	logger *zap.Logger,
) func(intake *models.SystemIntake, logger *zap.Logger) (*models.SystemIntake, error) {
	return func(intake *models.SystemIntake, logger *zap.Logger) (*models.SystemIntake, error) {
		if intake.AlfabetID.Valid {
			err := &apperrors.CedarError{
				Err:       errors.New("intake has already been submitted to CEDAR"),
				Operation: apperrors.CedarSubmit,
				IntakeID:  intake.ID.String(),
			}
			return intake, err
		}
		alfabetID, err := submit(intake, logger)
		if err != nil {
			return nil, err
		}
		intake.Status = models.SystemIntakeStatusSUBMITTED
		intake.AlfabetID = null.StringFrom(alfabetID)

		err = save(intake)
		if err != nil {
			return nil, err
		}
		return intake, nil
	}
}
