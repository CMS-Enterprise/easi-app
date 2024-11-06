package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendTRBAdviceLetterInternalReviewEmailInput contains the data needed to to send the TRB advice
// letter internal review email
type SendTRBAdviceLetterInternalReviewEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	TRBLeadName    string
}

// trbAdviceLetterInternalReviewEmailTemplateParams contains the data needed for interpolation in
// the TRB advice letter internal review email template
type trbAdviceLetterInternalReviewEmailTemplateParams struct {
	TRBLeadName              string
	TRBRequestName           string
	TRBAdminAdviceLetterLink string
}

// SendTRBAdviceLetterInternalReviewEmail sends an email to the EASI admin team indicating that an advice letter
// is ready for internal review
func (c Client) SendTRBAdviceLetterInternalReviewEmail(ctx context.Context, input SendTRBAdviceLetterInternalReviewEmailInput) error {
	subject := "Advice letter for " + input.TRBRequestName + " is ready for internal review"

	templateParams := trbAdviceLetterInternalReviewEmailTemplateParams{
		TRBLeadName:              input.TRBLeadName,
		TRBRequestName:           input.TRBRequestName,
		TRBAdminAdviceLetterLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "advice")),
	}

	var b bytes.Buffer
	err := c.templates.trbAdviceLetterInternalReview.Execute(&b, templateParams)

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
