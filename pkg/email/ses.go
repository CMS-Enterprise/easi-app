package email

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/ses"
)

// SESConfig is email configs used only for SES
type SESConfig struct {
	SourceARN string
	Source    string
}

// SESSender is an implementation for sending email with the SES Go SDK
type SESSender struct {
	client *ses.SES
	config SESConfig
}

// Send sends an email
func (s SESSender) Send(
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
	return err
}
