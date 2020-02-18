package integration

// integration is a package for testing application routes
// it should attempt to mock as few dependencies as possible
// and simulate production application use

import (
	"os"
	"testing"

	"github.com/stretchr/testify/suite"
)

type IntegrationTestSuite struct {
	suite.Suite
	environment string
}

func TestIntegrationTestSuite(t *testing.T) {
	// TODO: replace `os` with another package for handling env
	testSuite := &IntegrationTestSuite{
		Suite:       suite.Suite{},
		environment: os.Getenv("ENVIRONMENT"),
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}
