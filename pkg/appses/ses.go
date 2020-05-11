package appses

import (
	"fmt"
	"html/template"
	"net/url"
	"path"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

// Config holds EASi application specific configs for SES
type Config struct {
	SourceARN         string
	Source            string
	GRTEmail          string
	URLHost           string
	URLScheme         string
	TemplateDirectory string
}

type templates struct {
	systemIntakeSubmissionTemplate *template.Template
}

// Client is an EASi SES client wrapper
type Client struct {
	config    Config
	client    *ses.SES
	templates templates
}

func templateError(name string) error {
	return fmt.Errorf("failed to get template: %s", name)
}

// NewClient returns a new SES Client for EASi
func NewClient(config Config) (Client, error) {
	sesSession := session.Must(session.NewSession())
	sesClient := ses.New(sesSession)

	rawTemplates, err := template.ParseGlob(path.Join(config.TemplateDirectory, "*.gohtml"))
	if err != nil {
		return Client{}, err
	}
	appTemplates := templates{}

	systemIntakeSubmissionTemplateName := "system_intake_submission.gohtml"
	systemIntakeSubmissionTemplate := rawTemplates.Lookup(systemIntakeSubmissionTemplateName)
	if systemIntakeSubmissionTemplate == nil {
		return Client{}, templateError(systemIntakeSubmissionTemplateName)
	}
	appTemplates.systemIntakeSubmissionTemplate = systemIntakeSubmissionTemplate

	client := Client{
		config:    config,
		client:    sesClient,
		templates: appTemplates,
	}
	return client, nil
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

func (c Client) urlFromPath(path string) string {
	u := url.URL{
		Scheme: c.config.URLScheme,
		Host:   c.config.URLHost,
		Path:   path,
	}
	return u.String()
}
