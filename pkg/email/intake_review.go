package email

import (
	"bytes"
	"context"
	"errors"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type intakeReview struct {
	ProjectName  string
	GRTEmail     string
	Requester    string
	EmailText    template.HTML
	TaskListPath string
}

func (c Client) systemIntakeReviewBody(
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	emailText models.HTML,
) (string, error) {
	taskListPath := path.Join("governance-task-list", systemIntakeID.String())
	data := intakeReview{
		ProjectName:  projectName,
		GRTEmail:     string(c.config.GRTEmail),
		Requester:    requester,
		EmailText:    emailText.ToTemplate(),
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
	emailText models.HTML,
) error {
	subject := "Feedback for request in EASi"
	body, err := c.systemIntakeReviewBody(systemIntakeID, projectName, requester, emailText)
	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(c.listAllRecipients(recipients)).
			WithSubject(subject).
			WithBody(body),
	)
}
