package email

import (
	"bytes"
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type intakeReview struct {
	EmailText string
}

func (c Client) systemIntakeReviewBody(EmailText string) (string, error) {
	data := intakeReview{
		EmailText: EmailText,
	}
	var b bytes.Buffer
	if c.templates.intakeReviewTemplate == nil {
		return "", errors.New("system intake review template is nil")
	}
	err := c.templates.intakeReviewTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSystemIntakeReviewEmail sends an email for a submitted system intake
func (c Client) SendSystemIntakeReviewEmail(ctx context.Context, emailText string, recipientAddress string) error {
	subject := "Feedback on your intake request"
	body, err := c.systemIntakeReviewBody(emailText)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		recipientAddress,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
