package email

import (
	"bytes"
	"context"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SendTRBRequestTRBLeadEmailInput contains the data submitted by the user to the "report a problem" help form
type SendTRBRequestTRBLeadEmailInput struct {
	TRBRequestName string
	RequesterName  string
	TRBLeadName    string
}

// SendTRBRequestTRBLeadEmail sends an email to the EASI team containing a user's request for help
func (c Client) SendTRBRequestTRBLeadEmail(ctx context.Context, input SendTRBRequestTRBLeadEmailInput) error {
	subject := input.TRBRequestName + " is assigned to " + input.TRBLeadName

	var b bytes.Buffer
	err := c.templates.trbRequestTRBLead.Execute(&b, input)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, []models.EmailAddress{c.config.TRBEmail}, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
