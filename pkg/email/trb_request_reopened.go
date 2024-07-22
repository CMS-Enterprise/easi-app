package email

import (
	"bytes"
	"context"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendTRBRequestReopenedEmailInput contains the data needed to to send the TRB advice
// letter submitted email
type SendTRBRequestReopenedEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	RequesterName  string
	Recipients     []models.EmailAddress
	CopyTRBMailbox bool
	ReasonReopened models.HTML
}

// trbRequestReopenedEmailTemplateParams contains the data needed for interpolation in
// the TRB request re-opened email
type trbRequestReopenedEmailTemplateParams struct {
	TRBRequestName      string
	ReasonReopened      template.HTML
	TRBRequestLink      string
	TRBAdminRequestLink string
	RequesterName       string
	TRBEmail            models.EmailAddress
}

// SendTRBRequestReopenedEmail sends an email to the EASI admin team indicating that a TRB request
// has been re-opened
func (c Client) SendTRBRequestReopenedEmail(ctx context.Context, input SendTRBRequestReopenedEmailInput) error {
	subject := "The TRB request " + input.TRBRequestName + " has been re-opened."

	allRecipients := input.Recipients
	if input.CopyTRBMailbox {
		allRecipients = append(input.Recipients, c.config.TRBEmail)
	}

	templateParams := trbRequestReopenedEmailTemplateParams{
		TRBRequestName:      input.TRBRequestName,
		RequesterName:       input.RequesterName,
		ReasonReopened:      input.ReasonReopened.ToTemplate(),
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBAdminRequestLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "request")),
		TRBEmail:            c.config.TRBEmail,
	}

	var b bytes.Buffer
	err := c.templates.trbRequestReopened.Execute(&b, templateParams)

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
