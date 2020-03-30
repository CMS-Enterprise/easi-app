package integration

// integration is a package for testing application routes
// it should attempt to mock as few dependencies as possible
// and simulate production application use

import (
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type IntegrationTestSuite struct {
	suite.Suite
	environment string
	logger      *zap.Logger
	config      *viper.Viper
}

func TestIntegrationTestSuite(t *testing.T) {
	config := viper.New()
	config.AutomaticEnv()

	testSuite := &IntegrationTestSuite{
		Suite:       suite.Suite{},
		environment: config.GetString("ENVIRONMENT"),
		logger:      zap.NewNop(),
		config:      config,
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}
