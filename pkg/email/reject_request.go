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

type rejectRequest struct {
	ProjectName  string
	GRTEmail     string
	Requester    string
	Reason       template.HTML
	NextSteps    template.HTML
	Feedback     template.HTML
	DecisionLink string
}

func (c Client) rejectRequestBody(
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	reason models.HTML,
	nextSteps models.HTML,
	feedback models.HTML,
) (string, error) {
	decisionPath := path.Join("governance-task-list", systemIntakeID.String(), "request-decision")
	data := rejectRequest{
		ProjectName:  projectName,
		GRTEmail:     string(c.config.GRTEmail),
		Requester:    requester,
		Reason:       reason.ToTemplate(),
		NextSteps:    nextSteps.ToTemplate(),
		Feedback:     feedback.ToTemplate(),
		DecisionLink: c.urlFromPath(decisionPath),
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

// SendRejectRequestEmails sends emails to multiple recipients (possibly including the IT Governance and IT Investment teams) for rejecting a request
func (c Client) SendRejectRequestEmails(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	reason models.HTML,
	nextSteps models.HTML,
	feedback models.HTML,
) error {
	subject := "Request in EASi not approved"
	body, err := c.rejectRequestBody(systemIntakeID, projectName, requester, reason, nextSteps, feedback)
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
