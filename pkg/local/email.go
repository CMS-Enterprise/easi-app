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

// SMTPSender is a basic email sender that connects to an SMTP server; use with MailCatcher for testing locally
type SMTPSender struct {
	serverAddress string
}

// NewSMTPSender configures and returns an SMTPSender for local testing
func NewSMTPSender(serverAddress string) SMTPSender {
	return SMTPSender{
		serverAddress,
	}
}

// Send sends and logs an email
func (sender SMTPSender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	ccAddresses := ""

	e := email.Email{
		From:    "testsender@oddball.dev",
		To:      []string{toAddress.String()},
		Subject: subject,
		HTML:    []byte(body),
	}
	if ccAddress != nil {
		e.Cc = []string{ccAddress.String()}
		ccAddresses = ccAddress.String()
	}

	appcontext.ZLogger(ctx).Info("Sending email using SMTP server",
		zap.String("To", toAddress.String()),
		zap.String("CC", ccAddresses),
		zap.String("Subject", subject),
		zap.String("Body", body),
	)

	err := e.Send(sender.serverAddress, nil)
	return err
}
