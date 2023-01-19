package alerts

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func checkForLCIDExpiration(
	ctx context.Context,
	fetchSystemIntakes func(context.Context) (models.SystemIntakes, error),
	updateSystemIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	sendLCIDExpirationEmail func(ctx context.Context, requestName string, lcidExpirationDate *time.Time, intakeID uuid.UUID) error,
) error {

	// Fetch all system intakes
	var result models.SystemIntakes
	result, err := fetchSystemIntakes(ctx)

	if err != nil {
		appcontext.ZLogger(ctx).Warn(fmt.Sprintf("Failed to fetch system intakes for LCID Expiration check. %s", err))
		return err
	}

	currentDate := time.Now()

	for _, currIntake := range result {

		// Check if intake has an LCID
		if currIntake.LifecycleExpiresAt != nil {

			hoursUntilLCIDExpiration := currIntake.LifecycleExpiresAt.Sub(currentDate).Hours()

			var hoursSinceFirstAlert float64
			if currIntake.LifecycleExpirationAlertTS != nil {
				hoursSinceFirstAlert = currentDate.Sub(*currIntake.LifecycleExpirationAlertTS).Hours()
			}

			// Check if intake's LCID will expire within 60 days (1440 hours) AND hasn't expired
			if hoursUntilLCIDExpiration < 1440 && hoursUntilLCIDExpiration > 0 {

				// Check if an alert has ever been sent
				if currIntake.LifecycleExpirationAlertTS == nil {
					err = sendLCIDExpirationEmail(ctx, currIntake.ProjectName.String, currIntake.LifecycleExpiresAt, currIntake.ID)
					if err != nil {
						appcontext.ZLogger(ctx).Error("LCID Expiration Alert email failed to send: ", zap.Error(err))
					}

					// Set LifecycleExpirationAlertTS to current date
					updatedIntake := currIntake
					updatedIntake.LifecycleExpirationAlertTS = &currentDate

					_, err = updateSystemIntake(ctx, &updatedIntake)
					if err != nil {
						return &apperrors.QueryError{
							Err:       err,
							Model:     updatedIntake,
							Operation: apperrors.QuerySave,
						}
					}

					// Check if first alert was sent more then 14 days (336 hours) ago
				} else if hoursSinceFirstAlert > 336 {
					err = sendLCIDExpirationEmail(ctx, currIntake.ProjectName.String, currIntake.LifecycleExpiresAt, currIntake.ID)
					if err != nil {
						appcontext.ZLogger(ctx).Error("LCID Expiration Alert email failed to send: ", zap.Error(err))
					}

					// Set LifecycleExpirationAlertTS to LCID expiration date
					// this ensures that alert will not be sent again (because hoursSinceFirstAlert will be negative until the LCID expires)
					updatedIntake := currIntake
					updatedIntake.LifecycleExpirationAlertTS = currIntake.LifecycleExpiresAt

					_, err = updateSystemIntake(ctx, &updatedIntake)
					if err != nil {
						return &apperrors.QueryError{
							Err:       err,
							Model:     updatedIntake,
							Operation: apperrors.QuerySave,
						}
					}
				}

				// If intake's LCID doesn't expire in the 60 day window and it's alert has been set, reset alert timestamp to nil
				// NOTE: this is to handle case where alert is sent, LCID expiration is extended, and the LCID re-enter's the 60 day window
			} else if currIntake.LifecycleExpirationAlertTS != nil {

				updatedIntake := currIntake
				updatedIntake.LifecycleExpirationAlertTS = nil

				_, err = updateSystemIntake(ctx, &updatedIntake)
				if err != nil {
					return &apperrors.QueryError{
						Err:       err,
						Model:     updatedIntake,
						Operation: apperrors.QuerySave,
					}
				}
			}
		}
	}

	return nil
}

// StartLcidExpirationCheck starts a goroutine that will run `checkForLCIDExpiration` based on lcidExpirationCheckTime.
// StartLcidExpirationCheck returns no errors, and only logs when something goes wrong.
// Upon being called, StartLcidExpirationCheck will check for expiring LCIDs once immediately, then again at an interval specified by lcidExpirationCheckTime.
func StartLcidExpirationCheck(
	ctx context.Context,
	fetchSystemIntakes func(context.Context) (models.SystemIntakes, error),
	updateSystemIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	sendLCIDExpirationEmail func(ctx context.Context, requestName string, lcidExpirationDate *time.Time, intakeID uuid.UUID) error,
	lcidExpirationCheckTime time.Duration,
) {
	ticker := time.NewTicker(lcidExpirationCheckTime)
	go func(ctx context.Context) {
		for {
			err := checkForLCIDExpiration(ctx, fetchSystemIntakes, updateSystemIntake, sendLCIDExpirationEmail)
			if err != nil {
				// Should this be a warning or error?
				appcontext.ZLogger(ctx).Warn("Failed to check for LCID Expiration", zap.Error(err))
			}

			// Wait for the ticker. This will block the current goroutine until the ticker sends a message over the channel
			<-ticker.C
		}
	}(ctx)
}
