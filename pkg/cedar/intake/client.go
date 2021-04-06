// Package intake serves as an Anti-Corruption Layer (in Domain Driven Design
// parlance), keeping the implementation details of working with the
// downstream CEDAR Intake API well separated, so the rest of the internal
// workings of the EASi code are not using anything defined by the
// external API
package intake

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	emitFlagKey = "emit-to-cedar"
	emitDefault = false
)

// NewClient builds the type that holds a connection to the CEDAR Intake API
func NewClient(cedarHost string, cedarAPIKey string, ldClient *ld.LDClient) *Client {
	_ = cedarHost
	_ = cedarAPIKey

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

	return &Client{emitToCedar: fnEmit}
}

// Client represents a connection to the CEDAR Intake API
type Client struct {
	emitToCedar func(context.Context) bool
}

// CheckConnection hits the CEDAR Intake API `/healthcheck` endpoint to verify
// that our connection is functional
func (c *Client) CheckConnection(ctx context.Context) error {
	if !c.emitToCedar(ctx) {
		return nil
	}
	return fmt.Errorf("not yet implemented")
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
	if !c.emitToCedar(ctx) {
		id := uuid.Nil
		if si != nil {
			id = si.ID
		}
		appcontext.ZLogger(ctx).Info("snapshot publishing disabled", zap.String("intakeID", id.String()))
		return nil
	}
	return fmt.Errorf("not yet implemented")
}
