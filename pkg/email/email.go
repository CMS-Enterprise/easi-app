package email

import (
	"fmt"
	"html/template"
	"net/url"
	"path"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

// Config holds EASi application specific configs for SES
type Config struct {
	GRTEmail          string
	URLHost           string
	URLScheme         string
	TemplateDirectory string
}

type templates struct {
	systemIntakeSubmissionTemplate *template.Template
}

type sender interface {
	Send(toAddress string, subject string, body string) error
}

// Client is an EASi SES client wrapper
type Client struct {
	config    Config
	templates templates
	sender    sender
}

func templateError(name string) error {
	return fmt.Errorf("failed to get template: %s", name)
}

// NewClient returns a new SES Client for EASi
func NewClient(config Config, sesConfig SESConfig) (Client, error) {
	sesSession := session.Must(session.NewSession())
	sesClient := ses.New(sesSession)
	sesSender := sesSender{
		sesClient,
		sesConfig,
	}

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
		templates: appTemplates,
		sender:    sesSender,
	}
	return client, nil
}

func (c Client) urlFromPath(path string) string {
	u := url.URL{
		Scheme: c.config.URLScheme,
		Host:   c.config.URLHost,
		Path:   path,
	}
	return u.String()
}
