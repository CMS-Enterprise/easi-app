package email

import (
	"bytes"
	"context"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendTRBRequestConsultMeetingEmailInput contains the data submitted by the user to the "report a problem" help form
type SendTRBRequestConsultMeetingEmailInput struct {
	TRBRequestID       uuid.UUID
	ConsultMeetingTime time.Time
	CopyTRBMailbox     bool
	NotifyEmails       []models.EmailAddress
	TRBRequestName     string
	Notes              string
	RequesterName      string
}

// trbConsultMeetingEmailTemplateParams contains the data needed for interpolation in the TRB consult meeting
// email template
type trbConsultMeetingEmailTemplateParams struct {
	TRBRequestName              string
	ConsultMeetingTimeFormatted string
	Notes                       string
	RequesterName               string
	TRBRequestLink              string
	TRBHelpLink                 string
	TRBEmail                    models.EmailAddress
}

// SendTRBRequestConsultMeetingEmail sends an email to the EASI team containing a user's request for help
func (c Client) SendTRBRequestConsultMeetingEmail(ctx context.Context, input SendTRBRequestConsultMeetingEmailInput) error {
	subject := "TRB consult session scheduled for " + input.TRBRequestName
	est, err := time.LoadLocation("America/New_York")

	if err != nil {
		return err
	}

	templateParams := trbConsultMeetingEmailTemplateParams{
		TRBRequestName:              input.TRBRequestName,
		ConsultMeetingTimeFormatted: input.ConsultMeetingTime.In(est).Format("January 2, 2006 at 03:04 PM EST"),
		Notes:                       input.Notes,
		RequesterName:               input.RequesterName,
		TRBRequestLink:              c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBHelpLink:                 c.urlFromPath(path.Join("help", "trb", "prepare-consult-meeting")),
		TRBEmail:                    c.config.TRBEmail,
	}

	var b bytes.Buffer
	err = c.templates.trbRequestConsultMeeting.Execute(&b, templateParams)

	if err != nil {
		return err
	}

	recipients := input.NotifyEmails
	if input.CopyTRBMailbox {
		recipients = append(recipients, c.config.TRBEmail)
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(recipients).
			WithSubject(subject).
			WithBody(b.String()),
	)
}
