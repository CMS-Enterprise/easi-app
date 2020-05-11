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
		SourceARN:         config.GetString(appconfig.AWSSESSourceARNKey),
		Source:            config.GetString(appconfig.AWSSESSourceKey),
		GRTEmail:          config.GetString(appconfig.GRTEmailKey),
		URLHost:           config.GetString(appconfig.ApplicationHostKey),
		URLScheme:         config.GetString(appconfig.ApplicationProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	client, err := NewClient(sesConfig)
	if err != nil {
		t.Errorf("Failed to create email client %v", err)
	}
	sesTestSuite := &SESTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		client: client,
	}

	suite.Run(t, sesTestSuite)
}
