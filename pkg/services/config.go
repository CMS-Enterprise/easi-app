package services

import (
	"github.com/facebookgo/clock"
	"go.uber.org/zap"
)

// NewConfig returns a Config for services
func NewConfig(logger *zap.Logger) Config {
	return Config{
		clock:  clock.New(),
		logger: logger,
	}
}

// Config holds common configured object for services
type Config struct {
	clock  clock.Clock
	logger *zap.Logger
}
