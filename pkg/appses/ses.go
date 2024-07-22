package appses

import (
	"context"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// Config is email configs used only for SES
type Config struct {
	SourceARN string
	Source    string
}

// Sender is an implementation for sending email with the SES Go SDK
// It lives in package "email" for now, but can be pulled out and imported
// if necessary for testing
type Sender struct {
	client *ses.SES
	config Config
}

// NewSender constructs a Sender
func NewSender(config Config) Sender {
	sesSession := session.Must(session.NewSession())
	client := ses.New(sesSession)
	return Sender{
		client,
		config,
	}
}

// Send sends an email. It will only return an error if there's an error connecting to SES; an invalid address/bounced email will *not* return an error.
func (s Sender) Send(ctx context.Context, emailData email.Email) error {
	// Don't send an email if there's no recipients (even if there are ccAddresses)
	if len(emailData.ToAddresses) == 0 {
		appcontext.ZLogger(ctx).Warn("attempted to send an email with empty toAddresses")
		return nil
	}

	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses:  models.EmailAddressesToStringPtrs(emailData.ToAddresses),
			CcAddresses:  models.EmailAddressesToStringPtrs(emailData.CcAddresses),
			BccAddresses: models.EmailAddressesToStringPtrs(emailData.BccAddresses),
		},
		Message: &ses.Message{
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String(emailData.Subject),
			},
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(emailData.Body),
				},
			},
		},
		Source:    aws.String(s.config.Source),
		SourceArn: aws.String(s.config.SourceARN),
	}
	_, err := s.client.SendEmail(input)
	if err == nil {
		appcontext.ZLogger(ctx).Info("Sending email with SES",
			zap.Strings("To", models.EmailAddressesToStrings(emailData.ToAddresses)),
			zap.Strings("CC", models.EmailAddressesToStrings(emailData.CcAddresses)),
			zap.String("Subject", emailData.Subject),
		)
	}
	return err
}
