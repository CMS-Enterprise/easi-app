package appses

import (
	"context"
	"regexp"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// Config is email configs used only for SES
type Config struct {
	SourceARN               string
	Source                  string
	RecipientAllowListRegex *regexp.Regexp // a regex that a recipient must match in order to be sent to
}

// Sender is an implementation for sending email with the SES Go SDK
// It lives in package "email" for now, but can be pulled out and imported
// if necessary for testing
type Sender struct {
	client      *ses.SES
	config      Config
	environment appconfig.Environment
}

// NewSender constructs a Sender
func NewSender(config Config, environment appconfig.Environment) Sender {
	sesSession := session.Must(session.NewSession())
	client := ses.New(sesSession)
	return Sender{
		client,
		config,
		environment,
	}
}

func filterAddresses(emails []models.EmailAddress, regex *regexp.Regexp) []models.EmailAddress {
	if regex == nil { // don't attempt to match using a nil regex
		return emails
	}
	return lo.Filter(emails, func(email models.EmailAddress, idx int) bool {
		return regex.MatchString(string(email))
	})
}

// Send sends an email. It will only return an error if there's an error connecting to SES; an invalid address/bounced email will *not* return an error.
func (s Sender) Send(ctx context.Context, emailData email.Email) error {
	// Filter out any addresses that don't match the configured regex
	// If the env var that populates this is empty (""), everything will be allowed through (since the regex "" matches all strings)
	emailData.ToAddresses = filterAddresses(emailData.ToAddresses, s.config.RecipientAllowListRegex)
	emailData.CcAddresses = filterAddresses(emailData.CcAddresses, s.config.RecipientAllowListRegex)
	emailData.BccAddresses = filterAddresses(emailData.BccAddresses, s.config.RecipientAllowListRegex)

	// Don't send an email if there are no recipients (post-filter)
	if len(emailData.ToAddresses) == 0 && len(emailData.CcAddresses) == 0 && len(emailData.BccAddresses) == 0 {
		appcontext.ZLogger(ctx).Warn("attempted to send an email with no recipients")
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
				Data:    aws.String(email.AddNonProdEnvToSubject(emailData.Subject, s.environment)),
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
	return err
}
