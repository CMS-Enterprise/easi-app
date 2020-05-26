package appses

import (
	"fmt"
	"testing"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type SESTestSuite struct {
	suite.Suite
	logger *zap.Logger
	sender Sender
}

func TestSESTestSuite(t *testing.T) {
	// since this is an external service,
	// skip when testing with --short
	if testing.Short() {
		return
	}

	logger := zap.NewNop()
	config := testhelpers.NewConfig()

	if config.GetString(appconfig.EnvironmentKey) == appconfig.LocalEnv.String() {
		fmt.Println("Skipping AWS SES test in local environment")
		return
	}

	sesConfig := Config{
		SourceARN: config.GetString(appconfig.AWSSESSourceARNKey),
		Source:    config.GetString(appconfig.AWSSESSourceKey),
	}

	sesSession := session.Must(session.NewSession())
	client := ses.New(sesSession)
	sender := Sender{
		client,
		sesConfig,
	}

	sesTestSuite := &SESTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		sender: sender,
	}

	suite.Run(t, sesTestSuite)
}

func (s SESTestSuite) TestSend() {
	s.Run("Sends successfully", func() {
		err := s.sender.Send(
			"success@simulator.amazonses.com",
			"Test Subject",
			"Test Body",
		)

		s.NoError(err)
	})
}
