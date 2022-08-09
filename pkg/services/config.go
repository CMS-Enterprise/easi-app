package services

import (
	"context"

	"github.com/facebookgo/clock"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/flags"
)

// TODO - EASI-2021 - remove info for this feature flag
const (
	notifyMultipleRecipientsFlagName    = "notifyMultipleRecipients"
	notifyMultipleRecipientsFlagDefault = false
)

// NewConfig returns a Config for services
func NewConfig(logger *zap.Logger, ldc *ld.LDClient) Config {
	return Config{
		clock:    clock.New(),
		logger:   logger,
		ldClient: ldc,
	}
}

// Config holds common configured object for services
type Config struct {
	clock    clock.Clock
	logger   *zap.Logger
	ldClient *ld.LDClient
}

func (c *Config) checkBoolFeatureFlag(ctx context.Context, flagName string, flagDefault bool) bool {
	lduser := flags.Principal(ctx)
	result, err := c.ldClient.BoolVariation(flagName, lduser, flagDefault)
	if err != nil {
		appcontext.ZLogger(ctx).Info(
			"problem evaluating feature flag",
			zap.Error(err),
			zap.String("flagName", flagName),
			zap.Bool("flagDefault", flagDefault),
			zap.Bool("flagResult", result),
		)
	}
	return result
}
