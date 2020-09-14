package services

import (
	"github.com/facebookgo/clock"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v4"
)

// NewConfig returns a Config for services
func NewConfig(logger *zap.Logger, flagClient *ld.LDClient) Config {
	return Config{
		clock:      clock.New(),
		logger:     logger,
		flagClient: flagClient,
	}
}

// Config holds common configured object for services
type Config struct {
	clock      clock.Clock
	logger     *zap.Logger
	flagClient *ld.LDClient
}
