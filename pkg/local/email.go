package local

import (
	"context"

	"github.com/jordan-wright/email"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewSender returns a fake email sender
func NewSender() Sender {
	return Sender{}
}

// Sender is a mock email sender for local environments
type Sender struct {
}

// Send logs an email
func (s Sender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	ccAddresses := ""
	if ccAddress != nil {
		ccAddresses = ccAddress.String()
	}

	appcontext.ZLogger(ctx).Info("Mock sending email",
		zap.String("To", toAddress.String()),
		zap.String("CC", ccAddresses),
		zap.String("Subject", subject),
		zap.String("Body", body),
	)
	return nil
}

// PostfixSender is a basic email sender that connects to a Postfix server; use with MailCatcher for testing locally
type PostfixSender struct {
	serverAddress string
}

// NewPostfixSender configures and returns a PostfixSender for local testing
func NewPostfixSender(serverAddress string) PostfixSender {
	return PostfixSender{
		serverAddress,
	}
}

// Send sends an email
func (sender PostfixSender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	e := email.Email{
		From:    "testsender@oddball.dev",
		To:      []string{toAddress.String()},
		Subject: subject,
		HTML:    []byte(body),
	}
	if ccAddress != nil {
		e.Cc = []string{ccAddress.String()}
	}

	err := e.Send(sender.serverAddress, nil)
	return err
}
