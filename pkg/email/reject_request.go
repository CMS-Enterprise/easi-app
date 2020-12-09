package email

import (
	"bytes"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type rejectRequest struct {
	Reason    string
	NextSteps string
	Feedback  string
}

func (c Client) rejectRequestBody(reason string, nextSteps string, feedback string) (string, error) {
	data := rejectRequest{
		Reason:    reason,
		NextSteps: nextSteps,
		Feedback:  feedback,
	}
	var b bytes.Buffer
	if c.templates.rejectRequestTemplate == nil {
		return "", errors.New("reject request template is nil")
	}
	err := c.templates.rejectRequestTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendRejectRequestEmail sends an email for rejecting a request
func (c Client) SendRejectRequestEmail(recipient string, reason string, nextSteps string, feedback string) error {
	subject := "Your request has not been approved"
	body, err := c.rejectRequestBody(reason, nextSteps, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		recipient,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
