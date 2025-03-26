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

// SendTRBGuidanceLetterSubmittedEmailInput contains the data needed to to send the TRB guidance
// letter submitted email
type SendTRBGuidanceLetterSubmittedEmailInput struct {
	TRBRequestID     uuid.UUID
	RequestName      string
	RequestType      string
	RequesterName    string
	Component        string
	SubmissionDate   *time.Time
	ConsultDate      *time.Time
	CopyTRBMailbox   bool
	CopyITGovMailbox bool
	Recipients       []models.EmailAddress
}

// trbGuidanceLetterSubmittedEmailTemplateParams contains the data needed for interpolation in
// the TRB guidance letter submitted email template
type trbGuidanceLetterSubmittedEmailTemplateParams struct {
	RequestName           string
	RequesterName         string
	Component             string
	RequestType           string
	SubmissionDate        string
	ConsultDate           string
	TRBGuidanceLetterLink string
	TRBAdminRequestLink   string
	TRBRequestLink        string
	TRBInboxAddress       string
	TRBEmail              models.EmailAddress
}

// SendTRBGuidanceLetterSubmittedEmail sends an email to the EASI admin team indicating that a guidance letter
// has been submitted
func (c Client) SendTRBGuidanceLetterSubmittedEmail(ctx context.Context, input SendTRBGuidanceLetterSubmittedEmailInput) error {
	subject := "Guidance letter added for " + input.RequestName

	allRecipients := input.Recipients
	if input.CopyTRBMailbox {
		allRecipients = append(allRecipients, c.config.TRBEmail)
	}
	if input.CopyITGovMailbox {
		allRecipients = append(allRecipients, c.config.GRTEmail)
	}

	submissionDate := ""
	if input.SubmissionDate != nil {
		submissionDate = input.SubmissionDate.Format("January 2, 2006")
	}

	consultDate := ""
	if input.ConsultDate != nil {
		consultDate = input.ConsultDate.Format("January 2, 2006")
	}

	templateParams := trbGuidanceLetterSubmittedEmailTemplateParams{
		RequestName:           input.RequestName,
		RequesterName:         input.RequesterName,
		Component:             translation.GetComponentAcronym(input.Component),
		RequestType:           translation.GetTRBResponseType(input.RequestType),
		SubmissionDate:        submissionDate,
		ConsultDate:           consultDate,
		TRBGuidanceLetterLink: c.urlFromPath(path.Join("trb", "guidance-letter", input.TRBRequestID.String())),
		TRBAdminRequestLink:   c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "request")),
		TRBRequestLink:        c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
		TRBEmail:              c.config.TRBEmail,
	}

	var b bytes.Buffer
	err := c.templates.trbGuidanceLetterSubmitted.Execute(&b, templateParams)

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
