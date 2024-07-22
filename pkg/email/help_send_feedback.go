package email

import (
	"bytes"
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendFeedbackEmailInput contains the data submitted by the user to send feedback
type SendFeedbackEmailInput struct {
	IsAnonymous            bool
	ReporterName           string
	ReporterEmail          string
	CanBeContacted         bool
	EasiServicesUsed       []string
	CmsRole                string
	SystemEasyToUse        string
	DidntNeedHelpAnswering string
	QuestionsWereRelevant  string
	HadAccessToInformation string
	HowSatisfied           string
	HowCanWeImprove        string
}

// SendFeedbackEmail sends an email to the EASI team containing feedback from a user
func (c Client) SendFeedbackEmail(ctx context.Context, input SendFeedbackEmailInput) error {
	subject := "Feedback for EASi System"

	var b bytes.Buffer
	err := c.templates.helpSendFeedback.Execute(&b, input)

	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{c.config.EASIHelpEmail}).
			WithSubject(subject).
			WithBody(b.String()),
	)
}
