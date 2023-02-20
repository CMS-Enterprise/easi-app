package email

import (
	"bytes"
	"context"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
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
	TRBRequestLink      string
	TRBInboxAddress     string
	TRBEmail            models.EmailAddress
}

// SendTRBAdviceLetterSubmittedEmail sends an email to the EASI admin team indicating that an advice letter
// has been submitted
func (c Client) SendTRBAdviceLetterSubmittedEmail(ctx context.Context, input SendTRBAdviceLetterSubmittedEmailInput) error {
	subject := "Advice letter added for " + input.RequestName

	allRecipients := append(input.Recipients, c.config.TRBEmail)

	submissionDate := ""
	if input.SubmissionDate != nil {
		submissionDate = input.SubmissionDate.Format("January 2, 2006")
	}

	consultDate := ""
	if input.ConsultDate != nil {
		consultDate = input.ConsultDate.Format("January 2, 2006")
	}

	templateParams := trbAdviceLetterSubmittedEmailTemplateParams{
		RequestName:    input.RequestName,
		RequesterName:  input.RequesterName,
		Component:      input.Component,
		RequestType:    input.RequestType,
		SubmissionDate: submissionDate,
		ConsultDate:    consultDate,
		// TODO - figure out what this URL will be once it's in the frontend:
		TRBAdviceLetterLink: c.urlFromPath(path.Join("trb", "advice-letter", input.TRBRequestID.String())),
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBEmail:            c.config.TRBEmail,
	}

	var b bytes.Buffer
	err := c.templates.trbAdviceLetterSubmitted.Execute(&b, templateParams)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, allRecipients, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
