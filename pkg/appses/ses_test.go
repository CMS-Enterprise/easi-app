package appses

import (
	"context"
	"testing"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
	"github.com/cmsgov/easi-app/pkg/testlevels"
)

type SESTestSuite struct {
	suite.Suite
	logger *zap.Logger
	sender Sender
}

func TestSESTestSuite(t *testing.T) {
	testlevels.ExternalIntegrationTest(t) // external due to calling AWS SES

	logger := zap.NewNop()
	config := testhelpers.NewConfig()

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

func (s *SESTestSuite) TestSend() {
	s.Run("Sends successfully", func() {
		err := s.sender.Send(
			context.Background(),
			[]models.EmailAddress{"success@simulator.amazonses.com"},
			nil,
			"Test Subject",
			"Test Body",
		)

		s.NoError(err)
	})
	s.Run("Does nothing when passing empty toAddresses", func() {
		err := s.sender.Send(
			context.Background(),
			[]models.EmailAddress{},
			nil,
			"Test Subject",
			"Test Body",
		)

		s.NoError(err)
	})
}
