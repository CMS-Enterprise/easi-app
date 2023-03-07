package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SendTRBRequestClosedEmailInput contains the data needed to to send the TRB request closed email
type SendTRBRequestClosedEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	RequesterName  string
	Recipients     []models.EmailAddress
	ReasonClosed   string
}

// trbRequestClosedEmailTemplateParams contains the data needed for interpolation in
// the TRB request closed email
type trbRequestClosedEmailTemplateParams struct {
	TRBRequestName      string
	ReasonClosed        string
	TRBAdviceLetterLink string
	TRBRequestLink      string
	RequesterName       string
	TRBEmail            models.EmailAddress
}

// SendTRBRequestClosedEmail sends an email to the EASI admin team indicating that a TRB request
// has been closed
func (c Client) SendTRBRequestClosedEmail(ctx context.Context, input SendTRBRequestClosedEmailInput) error {
	subject := "The TRB request " + input.TRBRequestName + " has been closed."

	allRecipients := append(input.Recipients, c.config.TRBEmail)

	templateParams := trbRequestClosedEmailTemplateParams{
		TRBRequestName: input.TRBRequestName,
		RequesterName:  input.RequesterName,
		ReasonClosed:   input.ReasonClosed,
		// TODO - figure out what this URL will be once it's in the frontend:
		TRBAdviceLetterLink: c.urlFromPath(path.Join("trb", "advice-letter", input.TRBRequestID.String())),
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBEmail:            c.config.TRBEmail,
	}

	var b bytes.Buffer
	err := c.templates.trbRequestClosed.Execute(&b, templateParams)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, allRecipients, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
