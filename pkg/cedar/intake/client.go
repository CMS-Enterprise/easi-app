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

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"github.com/google/uuid"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/client"
	apioperations "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/client/operations"
	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	emitFlagKey = "emit-to-cedar"
	emitDefault = false
)

// NewClient builds the type that holds a connection to the CEDAR Intake API
func NewClient(cedarHost string, cedarAPIKey string, ldClient *ld.LDClient) *Client {
	fnEmit := func(ctx context.Context) bool {
		// this is the conditional way of stopping us from submitting to CEDAR; see EASI-1025
		lduser := flags.Principal(ctx)
		result, err := ldClient.BoolVariation(emitFlagKey, lduser, emitDefault)
		if err != nil {
			appcontext.ZLogger(ctx).Info(
				"problem evaluating feature flag",
				zap.Error(err),
				zap.String("flagName", emitFlagKey),
				zap.Bool("flagDefault", emitDefault),
				zap.Bool("flagResult", result),
			)
		}
		return result
	}

	hc := http.DefaultClient
	// if insecure, _ := strconv.ParseBool(os.Getenv("CEDAR_INSECURE")); insecure {
	// 	// CEDAR certificates are weird/incorrect in DEV environment,
	// 	// this can help you get around that problem
	// 	hc = &http.Client{
	// 		Transport: &http.Transport{
	// 			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	// 		},
	// 	}
	// }

	return &Client{
		emitToCedar: fnEmit,
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
	emitToCedar func(context.Context) bool
	auth        runtime.ClientAuthInfoWriter
	sdk         *apiclient.CEDARIntake
	hc          *http.Client
}

// CheckConnection hits the CEDAR Intake API `/healthcheck` endpoint to verify
// that our connection is functional
func (c *Client) CheckConnection(ctx context.Context) error {
	if !c.emitToCedar(ctx) {
		return nil
	}

	params := apioperations.NewHealthCheckGetParamsWithContext(ctx)
	params.HTTPClient = c.hc

	resp, err := c.sdk.Operations.HealthCheckGet(params, c.auth)
	if err != nil {
		return err
	}
	if resp.Payload == nil {
		return fmt.Errorf("no response body received")
	}
	return nil
}

// PublishSnapshot sends the given current state of a SystemIntake and all its
// associated entities to CEDAR for eventual storage in Alfabet
func (c *Client) PublishSnapshot(
	ctx context.Context,
	si *models.SystemIntake,
	bc *models.BusinessCase,
	acts []*models.Action,
	notes []*models.Note,
	fbs []*models.GRTFeedback,
) error {
	id := uuid.Nil
	if si != nil {
		id = si.ID
	}

	inputs, err := buildIntakes(ctx, si, bc, acts, notes, fbs)
	if err != nil {
		appcontext.ZLogger(ctx).Info(
			"problem building cedar payload",
			zap.String("intakeID", id.String()),
			zap.Error(err),
		)
		return nil
	}

	err = validateInputs(ctx, inputs)
	if err != nil {
		appcontext.ZLogger(ctx).Info(
			"problem validating cedar payload",
			zap.String("intakeID", id.String()),
			zap.Error(err),
		)
		return nil
	}

	if !c.emitToCedar(ctx) {
		appcontext.ZLogger(ctx).Info("snapshot publishing disabled", zap.String("intakeID", id.String()))
		return nil
	}

	params := apioperations.NewIntakeAddParamsWithContext(ctx)
	params.HTTPClient = c.hc
	params.Body.Intakes = inputs

	resp, err := c.sdk.Operations.IntakeAdd(params, c.auth)
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

func buildIntakes(
	ctx context.Context,
	si *models.SystemIntake,
	bc *models.BusinessCase,
	acts []*models.Action,
	notes []*models.Note,
	fbs []*models.GRTFeedback,
) ([]*wire.IntakeInput, error) {
	ii, err := translateSystemIntake(ctx, si)
	if err != nil {
		return nil, fmt.Errorf("unable to translate system intake: %w", err)
	}
	results := []*wire.IntakeInput{ii}

	if bc != nil {
		ii, err = translateBizCase(ctx, bc)
		if err != nil {
			return nil, fmt.Errorf("unable to translate business case: %w", err)
		}
		results = append(results, ii)
	}

	for _, act := range acts {
		ii, err = translateAction(ctx, act)
		if err != nil {
			return nil, fmt.Errorf("unable to translate action: %w", err)
		}
		results = append(results, ii)
	}

	for _, note := range notes {
		ii, err = translateNote(ctx, note)
		if err != nil {
			return nil, fmt.Errorf("unable to translate note: %w", err)
		}
		results = append(results, ii)
	}

	for _, fb := range fbs {
		ii, err = translateFeedback(ctx, fb)
		if err != nil {
			return nil, fmt.Errorf("unable to translate grt feedback: %w", err)
		}
		results = append(results, ii)
	}

	return results, nil
}
