package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchSystemIntakesByEuaID is a service to fetch system intakes by EUA id
func NewFetchSystemIntakesByEuaID(
	config Config,
	fetch func(euaID string) (models.SystemIntakes, error),
) func(euaID string) (models.SystemIntakes, error) {
	return func(euaID string) (models.SystemIntakes, error) {
		intakes, err := fetch(euaID)
		if err != nil {
			config.logger.Error("failed to fetch system intakes")
			return models.SystemIntakes{}, &apperrors.QueryError{
				Err:       err,
				Model:     intakes,
				Operation: apperrors.QueryFetch,
			}
		}
		return intakes, nil
	}
}

// NewCreateSystemIntake is a service to create a business case
func NewCreateSystemIntake(
	config Config,
	create func(intake *models.SystemIntake) (*models.SystemIntake, error),
) func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
	return func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		user, ok := appcontext.User(context)
		if !ok {
			// Default to failure to authorize and create a quick audit log
			config.logger.With(zap.Bool("Authorized", false)).
				With(zap.String("Operation", "CreateSystemIntake")).
				Info("something went wrong fetching the eua id from the context")
			return &models.SystemIntake{}, &apperrors.UnauthorizedError{}
		}
		intake.EUAUserID = user.EUAUserID
		// app validation belongs here
		createdIntake, err := create(intake)
		if err != nil {
			config.logger.Error("failed to create a system intake")
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QueryPost,
			}
		}
		return createdIntake, nil
	}
}

// NewAuthorizeSaveSystemIntake returns a function
// that authorizes a user for saving a system intake
func NewAuthorizeSaveSystemIntake(logger *zap.Logger) func(
	context context.Context,
	intake *models.SystemIntake,
) (bool, error) {
	return func(context context.Context, intake *models.SystemIntake) (bool, error) {
		user, ok := appcontext.User(context)
		if !ok {
			logger.Error("unable to get EUA ID from context")
			return false, &apperrors.ContextError{
				Operation: apperrors.ContextGet,
				Object:    "EUA ID",
			}
		}

		// If intake doesn't exist or owned by user, authorize
		if intake == nil || user.EUAUserID == intake.EUAUserID {
			logger.With(zap.Bool("Authorized", true)).
				With(zap.String("Operation", "UpdateSystemIntake")).
				Info("user authorized to save system intake")
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			With(zap.String("Operation", "UpdateSystemIntake")).
			Info("unauthorized attempt to save system intake")
		return false, nil
	}
}

// NewUpdateSystemIntake is a service to update a system intake
func NewUpdateSystemIntake(
	config Config,
	update func(intake *models.SystemIntake) (*models.SystemIntake, error),
	fetch func(id uuid.UUID) (*models.SystemIntake, error),
	authorize func(context context.Context, intake *models.SystemIntake) (bool, error),
	validateAndSubmit func(intake *models.SystemIntake, logger *zap.Logger) (string, error),
	sendEmail func(requester string, intakeID uuid.UUID) error,
) func(context context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		existingIntake, fetchErr := fetch(intake.ID)
		if fetchErr != nil {
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     existingIntake,
			}
		}
		ok, err := authorize(ctx, existingIntake)
		if err != nil {
			return &models.SystemIntake{}, err
		}
		if !ok {
			return &models.SystemIntake{}, &apperrors.UnauthorizedError{Err: err}
		}
		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime

		if intake.Status == models.SystemIntakeStatusSUBMITTED {
			if intake.AlfabetID.Valid {
				err := &apperrors.ResourceConflictError{
					Err:        errors.New("intake has already been submitted to CEDAR"),
					ResourceID: intake.ID.String(),
					Resource:   intake,
				}
				return &models.SystemIntake{}, err
			}

			intake.SubmittedAt = &updatedTime
			alfabetID, validateAndSubmitErr := validateAndSubmit(intake, config.logger)
			if validateAndSubmitErr != nil {
				return &models.SystemIntake{}, validateAndSubmitErr
			}
			if alfabetID == "" {
				return &models.SystemIntake{}, &apperrors.ExternalAPIError{
					Err:       errors.New("submission was not successful"),
					Model:     intake,
					ModelID:   intake.ID.String(),
					Operation: apperrors.Submit,
					Source:    "CEDAR",
				}
			}
			intake.AlfabetID = null.StringFrom(alfabetID)
		}
		intake, err = update(intake)
		if err != nil {
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}
		// only send an email when everything went ok
		if intake.Status == models.SystemIntakeStatusSUBMITTED {
			err = sendEmail(intake.Requester, intake.ID)
			if err != nil {
				return &models.SystemIntake{}, err
			}
		}
		return intake, nil
	}
}

// NewFetchSystemIntakeByID is a service to fetch the system intake by intake id
func NewFetchSystemIntakeByID(
	config Config,
	fetch func(id uuid.UUID) (*models.SystemIntake, error),
) func(id uuid.UUID) (*models.SystemIntake, error) {
	return func(id uuid.UUID) (*models.SystemIntake, error) {
		intake, err := fetch(id)
		if err != nil {
			config.logger.Error("failed to fetch system intake")
			return &models.SystemIntake{}, &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QueryFetch,
			}
		}
		return intake, nil
	}
}
