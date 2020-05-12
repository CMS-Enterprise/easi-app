package email

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type SESTestSuite struct {
	suite.Suite
	logger *zap.Logger
	config Config
}

type mockSender struct {
	toAddress string
	subject   string
	body      string
}

func (s *mockSender) Send(toAddress string, subject string, body string) error {
	s.toAddress = toAddress
	s.subject = subject
	s.body = body
	return nil
}

type mockFailedSender struct{}

func (s *mockFailedSender) Send(toAddress string, subject string, body string) error {
	return errors.New("sender had an error")
}

func TestSESTestSuite(t *testing.T) {
	logger := zap.NewNop()
	config := testhelpers.NewConfig()

	emailConfig := Config{
		GRTEmail:          config.GetString(appconfig.GRTEmailKey),
		URLHost:           config.GetString(appconfig.ApplicationHostKey),
		URLScheme:         config.GetString(appconfig.ApplicationProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	// we'll need this code for integration testing
	//sesConfig := SESConfig{
	//	SourceARN: config.GetString(appconfig.AWSSESSourceARNKey),
	//	Source:    config.GetString(appconfig.AWSSESSourceKey),
	//}

	//sesSession := session.Must(session.NewSession())
	//sesClient := ses.New(sesSession)
	//sesSender := SESSender{
	//	sesClient,
	//	sesConfig,
	//}

	sesTestSuite := &SESTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		config: emailConfig,
	}

	suite.Run(t, sesTestSuite)
}
