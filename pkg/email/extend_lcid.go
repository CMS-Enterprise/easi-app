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

type extendLCID struct {
	ProjectName     string
	GRTEmail        string
	Requester       string
	NewExpiresAt    string
	NewScope        template.HTML
	NewNextSteps    template.HTML
	NewCostBaseline string
	DecisionLink    string
}

func (c Client) extendLCIDBody(systemIntakeID uuid.UUID, projectName string, requester string, newExpiresAt *time.Time, newScope models.HTML, newNextSteps models.HTML, newCostBaseline string) (string, error) {
	decisionPath := path.Join("governance-task-list", systemIntakeID.String(), "request-decision")
	data := extendLCID{
		ProjectName:     projectName,
		GRTEmail:        string(c.config.GRTEmail),
		Requester:       requester,
		NewExpiresAt:    newExpiresAt.Format("January 2, 2006"),
		NewScope:        newScope.ToTemplate(),
		NewNextSteps:    newNextSteps.ToTemplate(),
		NewCostBaseline: newCostBaseline,
		DecisionLink:    c.urlFromPath(decisionPath),
	}

	var b bytes.Buffer
	if c.templates.extendLCIDTemplate == nil {
		return "", errors.New("extend LCID template is nil")
	}
	err := c.templates.extendLCIDTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendExtendLCIDEmails sends an email to multiple recipients (possibly including the IT Governance and IT Investment teams) for extending an LCID
func (c Client) SendExtendLCIDEmails(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	newExpiresAt *time.Time,
	newScope models.HTML,
	newNextSteps models.HTML,
	newCostBaseline string,
) error {
	subject := "Lifecycle ID extended"
	body, err := c.extendLCIDBody(systemIntakeID, projectName, requester, newExpiresAt, newScope, newNextSteps, newCostBaseline)
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
