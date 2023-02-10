package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SendTRBAdviceLetterInternalReviewEmailInput contains the data needed to to send the TRB advice
// letter internal review email
type SendTRBAdviceLetterInternalReviewEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	RequesterName  string
	TRBLeadName    string
}

// trbAdviceLetterInternalReviewEmailTemplateParams contains the data needed for interpolation in
// the TRB advice letter internal review email template
type trbAdviceLetterInternalReviewEmailTemplateParams struct {
	TRBLeadName         string
	TRBRequestName      string
	TRBAdviceLetterLink string
	TRBRequestLink      string
}

// SendTRBAdviceLetterInternalReviewEmail sends an email to the EASI admin team indicating that an advice letter
// is ready for internal review
func (c Client) SendTRBAdviceLetterInternalReviewEmail(ctx context.Context, input SendTRBAdviceLetterInternalReviewEmailInput) error {
	subject := "Advice letter for " + input.TRBRequestName + " is ready for internal review"

	templateParams := trbAdviceLetterInternalReviewEmailTemplateParams{
		TRBLeadName:    input.TRBLeadName,
		TRBRequestName: input.TRBRequestName,
		// TODO - figure out what this URL will be once it's in the frontend:
		TRBAdviceLetterLink: c.urlFromPath(path.Join("trb", "advice-letter", input.TRBRequestID.String())),
		TRBRequestLink:      c.urlFromPath(path.Join("trb", "task-list", input.TRBRequestID.String())),
	}

	var b bytes.Buffer
	err := c.templates.trbAdviceLetterInternalReview.Execute(&b, templateParams)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, []models.EmailAddress{c.config.TRBEmail}, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
