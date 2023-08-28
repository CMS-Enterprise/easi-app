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
	CopyTRBMailbox bool
	ReasonClosed   models.HTML
}

// trbRequestClosedEmailTemplateParams contains the data needed for interpolation in
// the TRB request closed email
type trbRequestClosedEmailTemplateParams struct {
	TRBRequestName      string
	ReasonClosed        models.HTML //TODO: EMAIL
	TRBRequestLink      string
	TRBAdminRequestLink string
	RequesterName       string
	TRBEmail            models.EmailAddress
}

// SendTRBRequestClosedEmail sends an email to the EASI admin team indicating that a TRB request
// has been closed
func (c Client) SendTRBRequestClosedEmail(ctx context.Context, input SendTRBRequestClosedEmailInput) error {
	subject := "The TRB request " + input.TRBRequestName + " has been closed."

	allRecipients := input.Recipients
	if input.CopyTRBMailbox {
		allRecipients = append(input.Recipients, c.config.TRBEmail)
	}

	templateParams := trbRequestClosedEmailTemplateParams{
		TRBRequestName:      input.TRBRequestName,
		RequesterName:       input.RequesterName,
		ReasonClosed:        input.ReasonClosed,
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBAdminRequestLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "request")),
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
