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

// SendTRBRequestConsultMeetingEmailInput contains the data submitted by the user to the "report a problem" help form
type SendTRBRequestConsultMeetingEmailInput struct {
	TRBRequestID                uuid.UUID
	ConsultMeetingTime          time.Time
	CopyTRBMailbox              bool
	NotifyEmails                []models.EmailAddress
	TRBRequestName              string
	Notes                       string
	RequesterName               string
	ConsultMeetingTimeFormatted string
	TRBEmail                    models.EmailAddress
	TRBRequestLink              string
}

// SendTRBRequestConsultMeetingEmail sends an email to the EASI team containing a user's request for help
func (c Client) SendTRBRequestConsultMeetingEmail(ctx context.Context, input SendTRBRequestConsultMeetingEmailInput) error {
	subject := "TRB consult session scheduled for " + input.TRBRequestName
	input.ConsultMeetingTimeFormatted = input.ConsultMeetingTime.Format("January 2, 2006 at 03:04 PM EST")
	input.TRBEmail = c.config.TRBEmail
	input.TRBRequestLink = path.Join("trb", "task-list", input.TRBRequestID.String())

	var b bytes.Buffer
	err := c.templates.trbRequestConsultMeeting.Execute(&b, input)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	recipients := input.NotifyEmails
	if input.CopyTRBMailbox {
		recipients = append(recipients, c.config.TRBEmail)
	}

	err = c.sender.Send(ctx, recipients, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
