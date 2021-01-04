package appses

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"go.uber.org/zap"
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
	logger *zap.Logger
}

// NewSender constructs a Sender
func NewSender(config Config, logger *zap.Logger) Sender {
	sesSession := session.Must(session.NewSession())
	client := ses.New(sesSession)
	return Sender{
		client,
		config,
		logger,
	}
}

// Send sends an email
func (s Sender) Send(
	toAddress string,
	subject string,
	body string,
) error {
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{
				aws.String(toAddress),
			},
		},
		Message: &ses.Message{
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String(subject),
			},
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(body),
				},
			},
		},
		Source:    aws.String(s.config.Source),
		SourceArn: aws.String(s.config.SourceARN),
	}
	_, err := s.client.SendEmail(input)
	if err == nil {
		s.logger.Info("Mock sending email",
			zap.String("To", toAddress),
			zap.String("Subject", subject),
			zap.String("Body", body),
		)
	}
	return err
}
