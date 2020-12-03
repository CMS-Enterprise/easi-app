package services

import (
	"context"
	"errors"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewBackfill imports historical data into EASi
func NewBackfill(
	config Config,
	createIntake func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	createNote func(c context.Context, note *models.Note) (*models.Note, error),
	authorize func(context.Context) (bool, error),
) func(context.Context, models.SystemIntake, []models.Note) error {
	return func(ctx context.Context, intake models.SystemIntake, notes []models.Note) error {
		ok, err := authorize(ctx)
		if err != nil {
			return err
		}
		if !ok {
			return &apperrors.ResourceNotFoundError{
				Err:      errors.New("failed to authorize backfill creation"),
				Resource: models.Note{},
			}
		}

		// invariant data for all backfill (maybe do this in transport layer, for de-normalizing fields?)
		intake.RequestType = models.SystemIntakeRequestTypeNEW // TODO: correct RequestType?
		intake.Status = models.SystemIntakeStatusNOTAPPROVED
		if intake.LifecycleID.ValueOrZero() != "" {
			intake.Status = models.SystemIntakeStatusLCIDISSUED
		}
		if _, err = createIntake(ctx, &intake); err != nil {
			return err
		}

		for _, note := range notes {
			// TODO: should this be done at transport layer
			note.SystemIntakeID = intake.ID
			note.AuthorEUAID = appcontext.Principal(ctx).ID()

			if _, err = createNote(ctx, &note); err != nil {
				return err
			}
		}
		appcontext.ZLogger(ctx).Info("created backfill document", zap.String("intakeID", intake.ID.String()))
		return nil
	}
}
