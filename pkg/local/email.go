package local

import (
	"context"

	"github.com/jordan-wright/email"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	easiemail "github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// NewSender returns a fake email sender
func NewSender() Sender {
	return Sender{}
}

// Sender is a mock email sender for local environments
type Sender struct {
}

// Send logs an email
func (s Sender) Send(ctx context.Context, emailData easiemail.Email) error {
	appcontext.ZLogger(ctx).Info("Mock sending email",
		zap.Strings("To", models.EmailAddressesToStrings(emailData.ToAddresses)),
		zap.Strings("CC", models.EmailAddressesToStrings(emailData.CcAddresses)),
		zap.Strings("BCC", models.EmailAddressesToStrings(emailData.BccAddresses)),
		zap.String("Subject", emailData.Subject),
		zap.String("Body", emailData.Body),
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
func (sender SMTPSender) Send(ctx context.Context, emailData easiemail.Email) error {
	// Don't send an email if there's no recipients (even if there are ccAddresses)
	if len(emailData.ToAddresses) == 0 {
		return nil
	}

	e := email.Email{
		From:    "testsender@oddball.dev",
		To:      models.EmailAddressesToStrings(emailData.ToAddresses),
		Cc:      models.EmailAddressesToStrings(emailData.CcAddresses),
		Bcc:     models.EmailAddressesToStrings(emailData.BccAddresses),
		Subject: emailData.Subject,
		HTML:    []byte(emailData.Body),
	}

	appcontext.ZLogger(ctx).Info("Sending email using SMTP server",
		zap.Strings("To", models.EmailAddressesToStrings(emailData.ToAddresses)),
		zap.Strings("CC", models.EmailAddressesToStrings(emailData.CcAddresses)),
		zap.Strings("BCC", models.EmailAddressesToStrings(emailData.BccAddresses)),
		zap.String("Subject", emailData.Subject),
		zap.String("Body", emailData.Body),
	)

	err := e.Send(sender.serverAddress, nil)
	return err
}
