package lcidactions

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// IsIntakeValidToIssueLCID checks if an intake is valid to have an LCID issued for it
func IsIntakeValidToIssueLCID(intake *models.SystemIntake) error {
	if intake.DecisionState == models.SIDSLcidIssued || intake.LifecycleID.ValueOrZero() != "" {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeISSUELCID,
				Message:    "LCID already issued for this intake, another LCID can't be issued",
			},
		}
	}

	return nil
}

// GenerateNewLCID takes a possibly-nil candidate for a new LCID and either returns it or generates a new LCID if necessary.
//
// Generating a new LCID requires two external checks:
//  1. A database call to check how many LCIDs have already been generated on the current day
//  2. Using store.clock.Now(), which is called within store.GenerateLifecycleID(), to check the current time
func GenerateNewLCID(ctx context.Context, store *storage.Store, possibleNewLCID *string) (string, error) {
	if possibleNewLCID != nil && *possibleNewLCID != "" {
		return *possibleNewLCID, nil
	}

	newLCID, err := store.GenerateLifecycleID(ctx)
	if err != nil {
		return "", err
	}

	return newLCID, nil
}
