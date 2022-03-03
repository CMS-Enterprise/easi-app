package email

import (
	"bytes"
	"context"
	"errors"
	"path"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
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

type rejectRequestInvalidRequester struct {
	EmailText    string
	TaskListPath string
}

func (c Client) rejectRequestInvalidRequesterBody(emailText string, taskListPath string) (string, error) {
	data := rejectRequestInvalidRequester{
		EmailText:    emailText,
		TaskListPath: c.urlFromPath(taskListPath),
	}
	var b bytes.Buffer

	if c.templates.rejectRequestInvalidRequesterTemplate == nil {
		return "", errors.New("reject request for invalid requester template is nil")
	}

	err := c.templates.rejectRequestInvalidRequesterTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendRejectRequestEmail sends an email for rejecting a request
func (c Client) SendRejectRequestEmail(ctx context.Context, recipient models.EmailAddress, reason string, nextSteps string, feedback string) error {
	subject := "Your request has not been approved"
	body, err := c.rejectRequestBody(reason, nextSteps, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		recipient,
		&c.config.GRTEmail,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}

// SendRejectRequestInvalidRequesterEmail sends an email to the governance team when a system intake with an invalid original requester is rejected
func (c Client) SendRejectRequestInvalidRequesterEmail(ctx context.Context, emailText string, intakeID uuid.UUID) error {
	subject := "Unable to notify requester of intake request rejection"
	taskListPath := path.Join("governance-task-list", intakeID.String())

	body, err := c.rejectRequestInvalidRequesterBody(emailText, taskListPath)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, c.config.GRTEmail, nil, subject, body)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
