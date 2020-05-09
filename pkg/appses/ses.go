package appses

import (
	"fmt"
	"net/url"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

// Config holds EASi application specific configs for SES
type Config struct {
	SourceARN       string
	Source          string
	GRTEmail        string
	ApplicationHost string
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

func (c Client) sendEmail(
	toAddress string,
	subject string,
	body string,
) (*ses.SendEmailOutput, error) {
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
		Source:    aws.String(c.config.Source),
		SourceArn: aws.String(c.config.SourceARN),
	}
	out, err := c.client.SendEmail(input)
	return out, err
}

func (c Client) htmlLink(path string, content string) string {
	u := url.URL{
		Scheme: "https",
		Host:   c.config.ApplicationHost,
		Path:   path,
	}
	link := fmt.Sprintf(
		"<a class=\"ulink\" href=\"%s\" target=\"_blank\">%s</a>",
		u.String(),
		content)
	return link
}
