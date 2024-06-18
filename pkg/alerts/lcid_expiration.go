package alerts

import (
	"context"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// Uses Okta API functions to get and build out recipient list for alert
// This should behave as follows:
// -- Send to requester and Governance Mailbox in case of no errors
// -- Send only to the Governance Mailbox in cases of "expected" errors (InvalidParameters and InvalidEUAID)
// -- Do not send in case of any other (or "unexpected") errors
func getAlertRecipients(
	ctx context.Context,
	intake models.SystemIntake,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
) (*models.EmailNotificationRecipients, error) {
	// don't fetch recipients if there is no EUA
	if intake.EUAUserID.ValueOrZero() == "" {
		return &models.EmailNotificationRecipients{
			RegularRecipientEmails:   []models.EmailAddress{},
			ShouldNotifyITGovernance: true,
			ShouldNotifyITInvestment: false,
		}, nil
	}

	requesterInfo, err := fetchUserInfo(ctx, intake.EUAUserID.ValueOrZero())
	var emailsToNotify []models.EmailAddress

	// Only return an error if we hit an "unexpected" error
	if err != nil {
		switch err.(type) {
		case *apperrors.InvalidParametersError: // Invalid Parameters error - log warning but do not return error
			appcontext.ZLogger(ctx).Warn(
				"Failed to fetch requester info while checking for LCID Expiration",
				zap.String("SystemIntakeID", intake.ID.String()),
				zap.Error(err),
			)
		case *apperrors.InvalidEUAIDError: // Invalid EUA ID error - log warning but do not return error
			appcontext.ZLogger(ctx).Warn(
				"Failed to fetch requester info while checking for LCID Expiration",
				zap.String("SystemIntakeID", intake.ID.String()),
				zap.Error(err),
			)
		default: // All other errors - log error and return error
			appcontext.ZLogger(ctx).Error(
				"Failed to fetch requester info while checking for LCID Expiration",
				zap.String("SystemIntakeID", intake.ID.String()),
				zap.Error(err),
			)
			return nil, err
		}
	} else {
		emailsToNotify = append(emailsToNotify, requesterInfo.Email)
	}

	// TODO: Add other members of project team that need to be notified
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   emailsToNotify,
		ShouldNotifyITGovernance: true,
		ShouldNotifyITInvestment: false,
	}

	return &recipients, nil
}

var day = time.Duration(time.Hour * 24)

// alertsInAdvance is the variable used to determine how many days
// before each LCID expiration date an alert should be sent
//
// NOTE: It's best to keep the values in descending order to keep the logic simple
// in shouldSendAlertForIntake(). Keep this in mind when adding new values.
var alertsInAdvance = []time.Duration{
	time.Duration(day * 120), // 120 days
	time.Duration(day * 60),  // 60 days
	time.Duration(day * 46),  // 46 days
}

// shouldSendAlertForIntake determines if it's valid to send an LCID expiration alert for a given System Intake
// It does this by first comparing the current date to the LCID expiration date to see if it's within the range of a specific alert
// Then, in order to ensure we don't send an alert for the same alert period twice, we check to see if the last alert's timestamp is _also_ before the date period
// If both of these are true, we're good to fire an alert off
func shouldSendAlertForIntake(intake models.SystemIntake, now time.Time) bool {
	// skip intake if it has an LCID retirement date set, regardless of whether that date's been reached or not
	if intake.LifecycleRetiresAt != nil {
		return false
	}

	// Skip intake if it doesn't have an LCID
	if intake.LifecycleExpiresAt == nil {
		return false
	}
	lcidExpiration := *intake.LifecycleExpiresAt // deref now that we're sure it's not nil

	// If the LCID has already expired, don't send an alert
	if now.After(lcidExpiration) {
		return false
	}

	// Iterate over each alert period to see if we should send an alert
	for _, daysInAdvance := range alertsInAdvance {
		// Calculate the target alert date by subtracting daysInAdvance from the expiration date
		targetAlertDate := intake.LifecycleExpiresAt.Add(-daysInAdvance)

		// If we haven't reached the target alert date yet, continue to checking the next target date
		if now.Before(targetAlertDate) {
			continue
		}

		// Make another check to see if EITHER of the following 2 statements are true:
		// 1. An alert HAS NOT BEEN sent before
		// 2. An alert HAS BEEN sent before, but it was sent for a prior target alert date
		if intake.LifecycleExpirationAlertTS == nil || intake.LifecycleExpirationAlertTS.Before(targetAlertDate) {
			return true
		}
	}

	return false
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
		lcidIssuedAt *time.Time,
		lcidExpirationDate *time.Time,
		scope models.HTML,
		lifecycleCostBaseline string,
		nextSteps models.HTML,
	) error,
) error {
	allIntakes, err := fetchSystemIntakes(ctx)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch system intakes for LCID Expiration check", zap.Error(err))
		return err
	}

	for _, currIntake := range allIntakes {
		if !shouldSendAlertForIntake(currIntake, currentDate) {
			continue
		}

		recipients, err := getAlertRecipients(ctx, currIntake, fetchUserInfo)
		// getAlertRecipients handles "expected" errors (InvalidParametersError and InvalidEUAIDError) w/o returning the error by logging the error and only adding the
		// Governance Mailbox to the recipient list. This is to handle intakes that have bad requester information. It will return an error in all other error cases
		if err != nil {
			continue
		}

		if err = sendLCIDExpirationEmail(
			ctx,
			*recipients,
			currIntake.ID,
			currIntake.ProjectName.String,
			currIntake.Requester,
			currIntake.LifecycleID.String,
			currIntake.LifecycleIssuedAt,
			currIntake.LifecycleExpiresAt,
			currIntake.LifecycleScope.ValueOrEmptyHTML(),
			currIntake.LifecycleCostBaseline.String,
			currIntake.DecisionNextSteps.ValueOrEmptyHTML(),
		); err != nil {
			appcontext.ZLogger(ctx).Error(
				"Failed to send LCID Expiration Alert email",
				zap.String("SystemIntakeID", currIntake.ID.String()),
				zap.Error(err),
			)
			continue
		}

		// Set LifecycleExpirationAlertTS to current date
		updatedIntake := currIntake
		updatedIntake.LifecycleExpirationAlertTS = &currentDate

		_, err = updateSystemIntake(ctx, &updatedIntake)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				"Failed to update systemIntake while checking for LCID Expiration",
				zap.String("SystemIntakeID", currIntake.ID.String()),
				zap.Error(err),
			)
			return &apperrors.QueryError{
				Err:       err,
				Model:     updatedIntake,
				Operation: apperrors.QuerySave,
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
		lcidIssuedAt *time.Time,
		lcidExpirationDate *time.Time,
		scope models.HTML,
		lifecycleCostBaseline string,
		nextSteps models.HTML,
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
