package integration

// integration is a package for testing application routes
// it should attempt to mock as few dependencies as possible
// and simulate production application use

import (
	"os"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type IntegrationTestSuite struct {
	suite.Suite
	environment string
	logger      *zap.Logger
}

func TestIntegrationTestSuite(t *testing.T) {
	testSuite := &IntegrationTestSuite{
		Suite:       suite.Suite{},
		environment: os.Getenv("ENVIRONMENT"),
		logger:      zap.NewNop(),
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}
