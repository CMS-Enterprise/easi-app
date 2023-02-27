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

// Uses CEDAR LDAP functions to get and build out recipient list for alert
func getAlertRecipients(
	ctx context.Context,
	intake models.SystemIntake,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
) (*models.EmailNotificationRecipients, error) {

	requesterInfo, err := fetchUserInfo(ctx, intake.EUAUserID.ValueOrZero())
	if err != nil {
		return nil, err
	}

	if requesterInfo == nil || requesterInfo.Email == "" {
		return nil, &apperrors.ExternalAPIError{
			Err:       fmt.Errorf("Requester info fetch was not successful when checking for LCID expiration for intake with ID: %s", intake.ID),
			Model:     intake,
			ModelID:   intake.ID.String(),
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
	}

	// TODO: Add other members of project team that need to be notified
	emailsToNotify := []models.EmailAddress{requesterInfo.Email}

	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   emailsToNotify,
		ShouldNotifyITGovernance: true,
		ShouldNotifyITInvestment: false,
	}

	return &recipients, nil
}

// Iterates through all intakes to check if LCID is expiring with the next 60 days
// If LCID is expiring with 60 days, an alert should be sent once and then again if LCID gets with 46 days (two weeks later) of expiration
func checkForLCIDExpiration(
	ctx context.Context,
	currentDate time.Time,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchSystemIntakes func(context.Context) (models.SystemIntakes, error),
	updateSystemIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	sendLCIDExpirationEmail func(
		ctx context.Context,
		recipients models.EmailNotificationRecipients,
		systemIntakeID uuid.UUID,
		projectName string,
		requesterName string,
		lcid string,
		lcidExpirationDate *time.Time,
		scope string,
		lifecycleCostBaseline string,
		nextSteps string,
	) error,
) error {

	// Fetch all system intakes
	var result models.SystemIntakes
	result, err := fetchSystemIntakes(ctx)

	if err != nil {
		appcontext.ZLogger(ctx).Warn(fmt.Sprintf("Failed to fetch system intakes for LCID Expiration check. %s", err))
		return err
	}

	for _, currIntake := range result {

		// Skip intake if it doesn't have an LCID
		if currIntake.LifecycleExpiresAt == nil {
			continue
		}

		hoursUntilLCIDExpiration := currIntake.LifecycleExpiresAt.Sub(currentDate).Hours()

		var hoursSinceFirstAlert float64
		if currIntake.LifecycleExpirationAlertTS != nil {
			hoursSinceFirstAlert = currentDate.Sub(*currIntake.LifecycleExpirationAlertTS).Hours()
		}

		// Check if intake's LCID will expire within 60 days (1440 hours) AND hasn't expired
		if hoursUntilLCIDExpiration < 1440 && hoursUntilLCIDExpiration > 0 {

			// Check if an alert has ever been sent
			if currIntake.LifecycleExpirationAlertTS == nil {

				// Alert has never been sent, send alert and set alert timestamp to now

				// Get email alert recipients
				var recipients *models.EmailNotificationRecipients
				recipients, err = getAlertRecipients(ctx, currIntake, fetchUserInfo)
				if err != nil {
					appcontext.ZLogger(ctx).Warn(fmt.Sprintf("Failed to get requester information from intake with ID: %s", currIntake.ID), zap.Error(err))
					continue
				}

				err = sendLCIDExpirationEmail(
					ctx,
					*recipients,
					currIntake.ID,
					currIntake.ProjectName.String,
					currIntake.Requester,
					currIntake.LifecycleID.String,
					currIntake.LifecycleExpiresAt,
					currIntake.LifecycleScope.String,
					currIntake.LifecycleCostBaseline.String,
					currIntake.DecisionNextSteps.String,
				)

				if err != nil {
					appcontext.ZLogger(ctx).Warn(fmt.Sprintf("Failed to send LCID Expiration Alert email for intake with ID: %s", currIntake.ID), zap.Error(err))
					continue
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

				// Alert was sent more then 14 days ago, send a follow up alert and set alert timestamp to LCID expiration date

				// Get email alert recipients
				var recipients *models.EmailNotificationRecipients
				recipients, err = getAlertRecipients(ctx, currIntake, fetchUserInfo)
				if err != nil {
					appcontext.ZLogger(ctx).Warn(fmt.Sprintf("Failed to get requester information from intake with ID: %s", currIntake.ID), zap.Error(err))
					continue
				}

				err = sendLCIDExpirationEmail(
					ctx,
					*recipients,
					currIntake.ID,
					currIntake.ProjectName.String,
					currIntake.Requester,
					currIntake.LifecycleID.String,
					currIntake.LifecycleExpiresAt,
					currIntake.LifecycleScope.String,
					currIntake.LifecycleCostBaseline.String,
					currIntake.DecisionNextSteps.String,
				)

				if err != nil {
					appcontext.ZLogger(ctx).Warn(fmt.Sprintf("Failed to send LCID Expiration Alert email for intake with ID: %s", currIntake.ID), zap.Error(err))
					continue
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

	return nil
}

// StartLcidExpirationCheck starts a goroutine that will run `checkForLCIDExpiration` based on lcidExpirationCheckTime.
// StartLcidExpirationCheck returns no errors, and only logs when something goes wrong.
// Upon being called, StartLcidExpirationCheck will check for expiring LCIDs once immediately, then again at an interval specified by lcidExpirationCheckTime.
func StartLcidExpirationCheck(
	ctx context.Context,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchSystemIntakes func(context.Context) (models.SystemIntakes, error),
	updateSystemIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
	sendLCIDExpirationEmail func(
		ctx context.Context,
		recipients models.EmailNotificationRecipients,
		systemIntakeID uuid.UUID,
		projectName string,
		requesterName string,
		lcid string,
		lcidExpirationDate *time.Time,
		scope string,
		lifecycleCostBaseline string,
		nextSteps string,
	) error,
	lcidExpirationCheckTime time.Duration,
) {
	ticker := time.NewTicker(lcidExpirationCheckTime)
	go func(ctx context.Context) {
		for {
			err := checkForLCIDExpiration(ctx, time.Now(), fetchUserInfo, fetchSystemIntakes, updateSystemIntake, sendLCIDExpirationEmail)
			if err != nil {
				appcontext.ZLogger(ctx).Error("Failed to check for LCID Expiration", zap.Error(err))
			}

			// Wait for the ticker. This will block the current goroutine until the ticker sends a message over the channel
			<-ticker.C
		}
	}(ctx)
}
