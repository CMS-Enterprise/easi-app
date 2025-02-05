// Package intake serves as an Anti-Corruption Layer (in Domain Driven Design
// parlance), keeping the implementation details of working with the
// downstream CEDAR Intake API well separated, so the rest of the internal
// workings of the EASi code are not using anything defined by the
// external API
package intake

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	apiclient "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/client"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/client/health_check"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/client/intake"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// NewClient builds the type that holds a connection to the CEDAR Intake API
func NewClient(cedarHost string, cedarAPIKey string, enabled bool, publisherEnabled bool) *Client {
	hc := http.DefaultClient

	return &Client{
		enabled:          enabled,
		publisherEnabled: publisherEnabled,
		auth: httptransport.APIKeyAuth(
			"x-Gateway-APIKey",
			"header",
			cedarAPIKey,
		),
		sdk: apiclient.New(
			httptransport.New(
				cedarHost,
				apiclient.DefaultBasePath,
				apiclient.DefaultSchemes,
			),
			strfmt.Default,
		),
		hc: hc,
	}
}

// Client represents a connection to the CEDAR Intake API
type Client struct {
	enabled          bool
	publisherEnabled bool
	auth             runtime.ClientAuthInfoWriter
	sdk              *apiclient.CEDARIntake
	hc               *http.Client
}

// CheckConnection hits the CEDAR Intake API `/healthcheck` endpoint to verify
// that our connection is functional
func (c *Client) CheckConnection(ctx context.Context) error {
	// If Intake API calls are not enabled, we don't need to check the connection, so just return nil
	if !c.enabled {
		return nil
	}

	params := health_check.NewHealthCheckParamsWithContext(ctx)
	params.HTTPClient = c.hc

	resp, err := c.sdk.HealthCheck.HealthCheck(params, c.auth)
	if err != nil {
		return err
	}
	if resp.Payload == nil {
		return fmt.Errorf("no response body received")
	}
	return nil
}

// PublishSystemIntake sends a system intake to CEDAR through the Intake API for eventual storage in Alfabet
func (c *Client) PublishSystemIntake(ctx context.Context, si models.SystemIntake) error {
	intakeObject := translation.TranslatableSystemIntake(si)
	return c.publishIntakeObject(ctx, &intakeObject)
}

// PublishBusinessCase sends a business case to CEDAR through the Intake API for eventual storage in Alfabet
func (c *Client) PublishBusinessCase(ctx context.Context, bc models.BusinessCaseWithCosts) error {
	intakeObject := translation.TranslatableBusinessCase(bc)
	return c.publishIntakeObject(ctx, &intakeObject)
}

// PublishGRTFeedback sends an item of GRT feedback to CEDAR through the Intake API for eventual storage in Alfabet
// func (c *Client) PublishGRTFeedback(ctx context.Context, feedback models.GRTFeedback) error {
// 	intakeObject := translation.TranslatableFeedback(feedback)
// 	return c.publishIntakeObject(ctx, &intakeObject)
// }

// PublishAction sends an action to CEDAR through the Intake API for eventual storage in Alfabet
func (c *Client) PublishAction(ctx context.Context, action models.Action) error {
	intakeObject := translation.TranslatableAction(action)
	return c.publishIntakeObject(ctx, &intakeObject)
}

// PublishNote sends a note to CEDAR through the Intake API for eventual storage in Alfabet
func (c *Client) PublishNote(ctx context.Context, note models.SystemIntakeNote) error {
	intakeObject := translation.TranslatableNote(note)
	return c.publishIntakeObject(ctx, &intakeObject)
}

// private method for publishing anything that satisfies the translation.IntakeObject interface to CEDAR through the Intake API
func (c *Client) publishIntakeObject(ctx context.Context, model translation.IntakeObject) error {
	// constant values for now; may become non-constant if/when we revisit handling CEDAR validation errors

	// from the Swagger (cedar_intake.json, definitions/IntakeInput/properties/version):
	// "The version associated with the object in the body. This value can be incremented in the event a transaction needs to be resubmitted."
	const objectVersion = 1

	// from the Swagger (cedar_intake.json, paths/"/intake"/post/parameters/validatePayload):
	// "Determines if schema validation of the payload is performed syncronously before persisting the record or asyncronously after the record has been persisted"
	const isValidatedSynchronously = false // false for V1 schemas; this may change when we implement V2 schemas for EASI-1614

	id := model.ObjectID()
	objectType := model.ObjectType()

	if !c.enabled {
		appcontext.ZLogger(ctx).Info("snapshot publishing is not enabled", zap.String("object ID", id), zap.String("object type", objectType))
		return nil
	}

	input, err := model.CreateIntakeModel(ctx)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"problem building cedar payload",
			zap.String("object ID", id),
			zap.String("object type", objectType),
			zap.Error(err),
		)
		return nil
	}

	params := intake.NewIntakeAddParamsWithContext(ctx)
	params.HTTPClient = c.hc
	params.Body = input

	params.ValidatePayload = strconv.FormatBool(isValidatedSynchronously)

	objectVersionStr := strconv.FormatInt(objectVersion, 10)
	params.Body.Version = &objectVersionStr

	resp, err := c.sdk.Intake.IntakeAdd(params, c.auth)
	if err != nil {
		return err
	}

	// TODO: we may need to read through the results for any "duplicate entry" error codes
	// that CEDAR _may_ send us, especially if we are re-transmitting entities... We
	// don't really care if there are dupes on their side, because we do NOT want to hold
	// any state on our side about who/what/when may have transmitted a previous copy
	// of the info to CEDAR.
	// appcontext.ZLogger(ctx).Info(fmt.Sprintf("results: %v", resp.Payload))
	_ = resp

	return nil
}

func (c *Client) PublishOnSchedule(ctx context.Context, store *storage.Store, dayOfWeek time.Weekday, hourInUTC int) {
	logger := appcontext.ZLogger(ctx)
	if hourInUTC > 24 || hourInUTC < 0 {
		logger.Error("incorrect hour given for publish schedule, use int between 0 and 24")
		return
	}
	// check both if cedar or the publisher is enabled. If not, return.
	if !c.enabled || !c.publisherEnabled {
		logger.Info("CEDAR intake publish schedule is disabled")
		return
	}

	for {
		nextPublish := getDurationUntilNextDayAndTime(time.Now().UTC(), dayOfWeek, hourInUTC)
		logger.Info(fmt.Sprintf(
			"next intake publish to CEDAR in %s at %s",
			nextPublish,
			time.Now().UTC().Add(nextPublish).Format(time.RFC3339),
		))
		time.Sleep(nextPublish)

		logger.Info("running scheduled intake publish to CEDAR")
		c.publishIntakeAndBusinessCase(ctx, store)
	}
}

func (c *Client) publishIntakeAndBusinessCase(ctx context.Context, store *storage.Store) {
	allIntakes, err := store.FetchSystemIntakes(ctx)
	if err != nil {
		appcontext.ZLogger(ctx).Warn("failed to fetch intakes when publishing to CEDAR", zap.Error(err))
		return
	}
	for _, intake := range allIntakes {
		err = c.PublishSystemIntake(ctx, intake)
		if err != nil {
			appcontext.ZLogger(ctx).Warn(
				"failed to publish intake when publishing to CEDAR",
				zap.String("id", intake.ID.String()),
				zap.Error(err),
			)
		}
		if intake.BusinessCaseID == nil {
			continue
		}
		businessCase, err := store.FetchBusinessCaseByID(ctx, *intake.BusinessCaseID)
		appcontext.ZLogger(ctx).Warn(
			"failed to fetch business case for intake when publishing to CEDAR",
			zap.String("id", intake.ID.String()),
			zap.Error(err),
		)
		if businessCase == nil {
			continue
		}
		err = c.PublishBusinessCase(ctx, *businessCase)
		if err != nil {
			appcontext.ZLogger(ctx).Warn(
				"failed to publish business case to CEDAR",
				zap.String("id", intake.ID.String()),
				zap.Error(err),
			)
		}
	}
}

// This function returns the duration from the start time to a given day of week and hour
func getDurationUntilNextDayAndTime(startTime time.Time, d time.Weekday, hour int) time.Duration {
	daysUntilTarget := getDaysTil(startTime.Weekday(), d)

	// given weekday matches start date, check if the time has passed given hour
	// if it has, add 7 days of duration
	if daysUntilTarget == 0 && startTime.After(getTimeAtHour(startTime, hour)) {
		daysUntilTarget = 7
	}

	// adds days to start time
	targetDay := startTime.AddDate(0, 0, daysUntilTarget)
	// sets hour of day on target day to given hour
	targetDayAndTime := getTimeAtHour(targetDay, hour)
	// return the duration (difference) between the start date and the given day and time
	return targetDayAndTime.Sub(startTime)
}

// This function gets the number of days until the given weekday from the start date
// getDaysTil(dateThatsAThursday.Weekday(), time.Friday) -> returns 1
// getDaysTil(time.Friday, time.Friday) -> returns 0
// getDaysTil(time.Saturday, time.Friday) -> returns 6
func getDaysTil(startDay time.Weekday, targetDay time.Weekday) int {
	return (int(targetDay) - int(startDay) + 7) % 7
}

// This function first sets the time to midnight through Truncate
// and then adds the provided hour to that time
// getTimeAtHour(date, 13) -> returns date with time at 1pm
func getTimeAtHour(t time.Time, hour int) time.Time {
	return t.Truncate(24 * time.Hour).Add(time.Duration(hour) * time.Hour)
}
