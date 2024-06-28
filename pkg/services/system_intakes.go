package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewArchiveSystemIntake is a service to archive a system intake
func NewArchiveSystemIntake(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	update func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	closeBusinessCase func(context.Context, uuid.UUID) error,
	authorized func(context context.Context, intake *models.SystemIntake) bool,
	sendWithdrawEmail func(ctx context.Context, requestName string) error,
) func(context.Context, uuid.UUID) error {
	return func(ctx context.Context, id uuid.UUID) error {
		intake, fetchErr := fetch(ctx, id)
		if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     intake,
			}
		}
		if !authorized(ctx, intake) {
			return &apperrors.UnauthorizedError{Err: errors.New("user is unauthorized to archive system intake")}
		}

		// We need to close any associated business case
		if intake.BusinessCaseID != nil {
			err := closeBusinessCase(ctx, *intake.BusinessCaseID)
			if err != nil {
				return err
			}
		}

		updatedTime := config.clock.Now()
		intake.UpdatedAt = &updatedTime
		intake.ArchivedAt = &updatedTime

		intake, err := update(ctx, intake)
		if err != nil {
			return &apperrors.QueryError{
				Err:       err,
				Model:     intake,
				Operation: apperrors.QuerySave,
			}
		}

		// Do not send email if intake was in a draft state (not submitted)
		if intake.SubmittedAt != nil {
			err = sendWithdrawEmail(ctx, intake.ProjectName.String)
			if err != nil {
				appcontext.ZLogger(ctx).Error("Withdraw email failed to send: ", zap.Error(err))
			}
		}

		return nil
	}
}
