package email

import (
	"bytes"
	"context"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendTRBAdviceLetterSubmittedEmailInput contains the data needed to to send the TRB advice
// letter submitted email
type SendTRBAdviceLetterSubmittedEmailInput struct {
	TRBRequestID   uuid.UUID
	RequestName    string
	RequestType    string
	RequesterName  string
	Component      string
	SubmissionDate *time.Time
	ConsultDate    *time.Time
	CopyTRBMailbox bool
	Recipients     []models.EmailAddress
}

// trbAdviceLetterSubmittedEmailTemplateParams contains the data needed for interpolation in
// the TRB advice letter submitted email template
type trbAdviceLetterSubmittedEmailTemplateParams struct {
	RequestName         string
	RequesterName       string
	Component           string
	RequestType         string
	SubmissionDate      string
	ConsultDate         string
	TRBAdviceLetterLink string
	TRBAdminRequestLink string
	TRBRequestLink      string
	TRBInboxAddress     string
	TRBEmail            models.EmailAddress
}

// SendTRBAdviceLetterSubmittedEmail sends an email to the EASI admin team indicating that an advice letter
// has been submitted
func (c Client) SendTRBAdviceLetterSubmittedEmail(ctx context.Context, input SendTRBAdviceLetterSubmittedEmailInput) error {
	subject := "Advice letter added for " + input.RequestName

	allRecipients := input.Recipients
	if input.CopyTRBMailbox {
		allRecipients = append(input.Recipients, c.config.TRBEmail)
	}

	submissionDate := ""
	if input.SubmissionDate != nil {
		submissionDate = input.SubmissionDate.Format("January 2, 2006")
	}

	consultDate := ""
	if input.ConsultDate != nil {
		consultDate = input.ConsultDate.Format("January 2, 2006")
	}

	templateParams := trbAdviceLetterSubmittedEmailTemplateParams{
		RequestName:         input.RequestName,
		RequesterName:       input.RequesterName,
		Component:           translation.GetComponentAcronym(input.Component),
		RequestType:         translation.GetTRBResponseType(input.RequestType),
		SubmissionDate:      submissionDate,
		ConsultDate:         consultDate,
		TRBAdviceLetterLink: c.urlFromPath(path.Join("trb", "advice-letter", input.TRBRequestID.String())),
		TRBAdminRequestLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "request")),
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBEmail:            c.config.TRBEmail,
	}

	var b bytes.Buffer
	err := c.templates.trbAdviceLetterSubmitted.Execute(&b, templateParams)

	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(allRecipients).
			WithSubject(subject).
			WithBody(b.String()),
	)
}
