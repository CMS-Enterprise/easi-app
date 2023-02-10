package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SendTRBRequestTRBLeadEmailInput contains the data needed to send an email to the TRB team
// indicating that a TRB lead has been assigned
type SendTRBRequestTRBLeadEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	RequesterName  string
	TRBLeadName    string
}

// trbLeadEmailTemplateParams contains the data needed for interpolation in the TRB lead email template
type trbLeadEmailTemplateParams struct {
	TRBLeadName    string
	TRBRequestName string
	TRBRequestLink string
	RequesterName  string
}

// SendTRBRequestTRBLeadEmail sends an email to the TRB team indicating that a TRB lead has been assigned
func (c Client) SendTRBRequestTRBLeadEmail(ctx context.Context, input SendTRBRequestTRBLeadEmailInput) error {
	subject := input.TRBRequestName + " is assigned to " + input.TRBLeadName

	templateParams := trbLeadEmailTemplateParams{
		TRBLeadName:    input.TRBLeadName,
		TRBRequestName: input.TRBRequestName,
		TRBRequestLink: c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		RequesterName:  input.RequesterName,
	}

	var b bytes.Buffer
	err := c.templates.trbRequestTRBLead.Execute(&b, templateParams)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, []models.EmailAddress{c.config.TRBEmail}, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
