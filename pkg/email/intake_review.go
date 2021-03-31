package email

import (
	"bytes"
	"context"
	"errors"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type intakeReview struct {
	EmailText    string
	TaskListPath string
}

func (c Client) systemIntakeReviewBody(EmailText string, taskListPath string) (string, error) {
	data := intakeReview{
		EmailText:    EmailText,
		TaskListPath: c.urlFromPath(taskListPath),
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
func (c Client) SendSystemIntakeReviewEmail(ctx context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error {
	subject := "Feedback on your intake request"
	taskListPath := path.Join("governance-task-list", intakeID.String())
	body, err := c.systemIntakeReviewBody(emailText, taskListPath)
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
