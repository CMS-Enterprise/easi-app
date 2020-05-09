package appses

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type SESTestSuite struct {
	suite.Suite
	logger *zap.Logger
	client Client
}

func TestSESTestSuite(t *testing.T) {
	logger := zap.NewNop()
	config := testhelpers.NewConfig()

	sesConfig := Config{
		SourceARN:       config.GetString(appconfig.AWSSESSourceARNKey),
		Source:          config.GetString(appconfig.AWSSESSourceKey),
		GRTEmail:        config.GetString(appconfig.GRTEmailKey),
		ApplicationHost: config.GetString(appconfig.ApplicationHostKey),
	}

	sesTestSuite := &SESTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		client: NewClient(sesConfig),
	}

	suite.Run(t, sesTestSuite)
}
