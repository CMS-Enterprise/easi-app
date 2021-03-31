package email

import (
	"context"
	"errors"
	"io"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type EmailTestSuite struct {
	suite.Suite
	logger *zap.Logger
	config Config
}

type mockSender struct {
	toAddress models.EmailAddress
	subject   string
	body      string
}

func (s *mockSender) Send(ctx context.Context, toAddress models.EmailAddress, subject string, body string) error {
	s.toAddress = toAddress
	s.subject = subject
	s.body = body
	return nil
}

type mockFailedSender struct{}

func (s *mockFailedSender) Send(ctx context.Context, toAddress models.EmailAddress, subject string, body string) error {
	return errors.New("sender had an error")
}

type mockFailedTemplateCaller struct{}

func (c mockFailedTemplateCaller) Execute(wr io.Writer, data interface{}) error {
	return errors.New("template caller had an error")
}

func TestEmailTestSuite(t *testing.T) {
	logger := zap.NewNop()
	config := testhelpers.NewConfig()

	emailConfig := Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	sesTestSuite := &EmailTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		config: emailConfig,
	}

	suite.Run(t, sesTestSuite)
}
