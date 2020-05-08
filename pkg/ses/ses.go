package ses

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

// Config holds EASi application specific configs for SES
type Config struct {
	SourceARN string
	Source    string
}

// Client is an EASi SES client wrapper
type Client struct {
	config Config
	client *ses.SES
}

// NewClient returns a new SES Client for EASi
func NewClient(config Config) Client {
	sesSession := session.Must(session.NewSession())
	sesClient := ses.New(sesSession)

	return Client{
		config: config,
		client: sesClient,
	}
}

func (c Client) sendEmail() (*ses.SendEmailOutput, error) {
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{
				aws.String("mikena@truss.works"),
			},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String("This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."),
				},
				Text: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String("This is the message body in text format."),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String("Test email"),
			},
		},
		Source:    aws.String(c.config.Source),
		SourceArn: aws.String(c.config.SourceARN),
	}
	out, err := c.client.SendEmail(input)
	return out, err
}
