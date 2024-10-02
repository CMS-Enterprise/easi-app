package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendTRBGuidanceLetterInternalReviewEmailInput contains the data needed to to send the TRB guidance
// letter internal review email
type SendTRBGuidanceLetterInternalReviewEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	TRBLeadName    string
}

// trbGuidanceLetterInternalReviewEmailTemplateParams contains the data needed for interpolation in
// the TRB guidance letter internal review email template
type trbGuidanceLetterInternalReviewEmailTemplateParams struct {
	TRBLeadName                string
	TRBRequestName             string
	TRBAdminGuidanceLetterLink string
}

// SendTRBGuidanceLetterInternalReviewEmail sends an email to the EASI admin team indicating that a guidance letter
// is ready for internal review
func (c Client) SendTRBGuidanceLetterInternalReviewEmail(ctx context.Context, input SendTRBGuidanceLetterInternalReviewEmailInput) error {
	subject := "Guidance letter for " + input.TRBRequestName + " is ready for internal review"

	templateParams := trbGuidanceLetterInternalReviewEmailTemplateParams{
		TRBLeadName:                input.TRBLeadName,
		TRBRequestName:             input.TRBRequestName,
		TRBAdminGuidanceLetterLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "guidance")),
	}

	var b bytes.Buffer
	err := c.templates.trbGuidanceLetterInternalReview.Execute(&b, templateParams)

	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{c.config.TRBEmail}).
			WithSubject(subject).
			WithBody(b.String()),
	)
}
