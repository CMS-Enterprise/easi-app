package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SendTRBRequestReopenedEmailInput contains the data needed to to send the TRB advice
// letter submitted email
type SendTRBRequestReopenedEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	RequesterName  string
	Recipients     []models.EmailAddress
	ReasonReopened string
}

// trbRequestReopenedEmailTemplateParams contains the data needed for interpolation in
// the TRB request re-opened email
type trbRequestReopenedEmailTemplateParams struct {
	TRBRequestName      string
	ReasonReopened      string
	TRBAdviceLetterLink string
	TRBRequestLink      string
	RequesterName       string
	TRBEmail            models.EmailAddress
}

// SendTRBRequestReopenedEmail sends an email to the EASI admin team indicating that a TRB request
// has been re-opened
func (c Client) SendTRBRequestReopenedEmail(ctx context.Context, input SendTRBRequestReopenedEmailInput) error {
	subject := "The TRB request " + input.TRBRequestName + " has been re-opened."

	allRecipients := append(input.Recipients, c.config.TRBEmail)

	templateParams := trbRequestReopenedEmailTemplateParams{
		TRBRequestName: input.TRBRequestName,
		RequesterName:  input.RequesterName,
		ReasonReopened: input.ReasonReopened,
		// TODO - figure out what this URL will be once it's in the frontend:
		TRBAdviceLetterLink: c.urlFromPath(path.Join("trb", "advice-letter", input.TRBRequestID.String())),
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBEmail:            c.config.TRBEmail,
	}

	var b bytes.Buffer
	err := c.templates.trbRequestReopened.Execute(&b, templateParams)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, allRecipients, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
