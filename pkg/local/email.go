package local

import (
	"context"
	"slices"

	"github.com/jordan-wright/email"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	easiemail "github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// NewSender returns a fake email sender
func NewSender(env appconfig.Environment) Sender {
	return Sender{
		environment: env,
	}
}

// Sender is a mock email sender for local environments
// TODO Figure out why we have 2 local senders (this one and SMTPSender)... can we consolidate??
// TODO Perhaps one is for testing and one is for local execution?
type Sender struct {
	environment appconfig.Environment
}

// Send logs an email
func (s Sender) Send(ctx context.Context, emailData easiemail.Email) error {
	appcontext.ZLogger(ctx).Info("Mock sending email",
		zap.Strings("To", models.EmailAddressesToStrings(emailData.ToAddresses)),
		zap.Strings("CC", models.EmailAddressesToStrings(emailData.CcAddresses)),
		zap.Strings("BCC", models.EmailAddressesToStrings(emailData.BccAddresses)),
		zap.String("Subject", easiemail.AddNonProdEnvToSubject(emailData.Subject, s.environment)),
		zap.String("Body", emailData.Body),
	)
	return nil
}

// SMTPSender is a basic email sender that connects to an SMTP server; use with MailCatcher for testing locally
type SMTPSender struct {
	serverAddress string
	environment   appconfig.Environment
}

// NewSMTPSender configures and returns an SMTPSender for local testing
func NewSMTPSender(serverAddress string, env appconfig.Environment) SMTPSender {
	return SMTPSender{
		serverAddress: serverAddress,
		environment:   env,
	}
}

// Send sends and logs an email
func (sender SMTPSender) Send(ctx context.Context, emailData easiemail.Email) error {
	// Don't send an email if there's no recipients
	if len(slices.Concat(emailData.ToAddresses, emailData.BccAddresses, emailData.CcAddresses)) == 0 {
		return nil
	}

	e := email.Email{
		From:    "testsender@oddball.dev",
		To:      models.EmailAddressesToStrings(emailData.ToAddresses),
		Cc:      models.EmailAddressesToStrings(emailData.CcAddresses),
		Bcc:     models.EmailAddressesToStrings(emailData.BccAddresses),
		Subject: easiemail.AddNonProdEnvToSubject(emailData.Subject, sender.environment),
		HTML:    []byte(emailData.Body),
	}

	appcontext.ZLogger(ctx).Info("Sending email using SMTP server",
		zap.Strings("To", e.To),
		zap.Strings("CC", e.Cc),
		zap.Strings("BCC", e.Bcc),
		zap.String("Subject", e.Subject),
		zap.ByteString("Body", e.HTML),
	)

	err := e.Send(sender.serverAddress, nil)
	return err
}
