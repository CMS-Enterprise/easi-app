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
				Model:     intakes,
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
	validateAndSubmit func(intake *models.SystemIntake, logger *zap.Logger) (string, error),
	sendEmail func(requester string, intakeID uuid.UUID) error,
	logger *zap.Logger,
	clock clock.Clock,
) func(context context.Context, intake *models.SystemIntake) error {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		existingIntake, fetchErr := fetch(intake.ID)
		if fetchErr != nil && fetchErr.Error() == "sql: no rows in result set" {
			existingIntake = nil
		} else if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     existingIntake,
			}
		}
		ok, err := authorize(ctx, existingIntake)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.UnauthorizedError{Err: err}
		}
		updatedTime := clock.Now().UTC()
		intake.UpdatedAt = &updatedTime
		if existingIntake == nil {
			intake.CreatedAt = &updatedTime
		}

		if intake.Status == models.SystemIntakeStatusSUBMITTED {
			if intake.AlfabetID.Valid {
				err := &apperrors.ResourceConflictError{
					Err:        errors.New("intake has already been submitted to CEDAR"),
					ResourceID: intake.ID.String(),
					Resource:   intake,
				}
				return err
			}

			intake.SubmittedAt = &updatedTime
			alfabetID, validateAndSubmitErr := validateAndSubmit(intake, logger)
			if validateAndSubmitErr != nil {
				return validateAndSubmitErr
			}
			if alfabetID == "" {
				return &apperrors.ExternalAPIError{
					Err:       errors.New("submission was not successful"),
					Model:     intake,
					ModelID:   intake.ID.String(),
					Operation: apperrors.Submit,
					Source:    "CEDAR",
				}
			}
			intake.AlfabetID = null.StringFrom(alfabetID)
		}
		err = save(intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}
		// only send an email when everything went ok
		if intake.Status == models.SystemIntakeStatusSUBMITTED {
			err = sendEmail(intake.Requester.ValueOrZero(), intake.ID)
			if err != nil {
				return err
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
				Model:     intake,
				Operation: apperrors.QueryFetch,
			}
		}
		return intake, nil
	}
}
