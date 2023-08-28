package email

import (
	"bytes"
	"context"
	"errors"
	"html/template"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type issueLCID struct {
	ProjectName           string
	GRTEmail              string
	Requester             string
	LifecycleID           string
	ExpiresAt             string
	Scope                 template.HTML
	LifecycleCostBaseline string
	NextSteps             template.HTML
	Feedback              template.HTML
	DecisionLink          string
}

func (c Client) issueLCIDBody(
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	lcid string,
	expiresAt *time.Time,
	scope models.HTML,
	lifecycleCostBaseline string,
	nextSteps models.HTML,
	feedback models.HTML,
) (string, error) {
	decisionPath := path.Join("governance-task-list", systemIntakeID.String(), "request-decision")
	data := issueLCID{
		ProjectName:           projectName,
		GRTEmail:              string(c.config.GRTEmail),
		Requester:             requester,
		LifecycleID:           lcid,
		ExpiresAt:             expiresAt.Format("January 2, 2006"),
		Scope:                 scope.ToTemplate(),
		LifecycleCostBaseline: lifecycleCostBaseline,
		NextSteps:             nextSteps.ToTemplate(),
		Feedback:              feedback.ToTemplate(),
		DecisionLink:          c.urlFromPath(decisionPath),
	}
	var b bytes.Buffer
	if c.templates.issueLCIDTemplate == nil {
		return "", errors.New("issue LCID template is nil")
	}
	err := c.templates.issueLCIDTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendIssueLCIDEmails sends an email to multiple recipients (possibly including the IT Governance and IT Investment teams) for issuing an LCID
func (c Client) SendIssueLCIDEmails(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	lcid string,
	expirationDate *time.Time,
	scope models.HTML,
	lifecycleCostBaseline string,
	nextSteps models.HTML,
	feedback models.HTML,
) error {
	subject := "Lifecycle ID request approved"
	body, err := c.issueLCIDBody(systemIntakeID, projectName, requester, lcid, expirationDate, scope, lifecycleCostBaseline, nextSteps, feedback)
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
