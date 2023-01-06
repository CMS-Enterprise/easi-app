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
	ProjectName  string
	GRTEmail     string
	Requester    string
	EmailText    string
	TaskListPath string
}

func (c Client) systemIntakeReviewBody(
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	emailText string,
) (string, error) {
	taskListPath := path.Join("governance-task-list", systemIntakeID.String())
	data := intakeReview{
		ProjectName:  projectName,
		GRTEmail:     string(c.config.GRTEmail),
		Requester:    requester,
		EmailText:    emailText,
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

// SendSystemIntakeReviewEmails sends emails to multiple recipients (possibly including the IT Governance and IT Investment teams) about GRT review on a submitted system intake
func (c Client) SendSystemIntakeReviewEmails(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	emailText string,
) error {
	subject := "Feedback for request in EASi"
	body, err := c.systemIntakeReviewBody(systemIntakeID, projectName, requester, emailText)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		c.listAllRecipients(recipients),
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
