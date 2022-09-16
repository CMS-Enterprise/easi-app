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

type rejectRequest struct {
	ProjectName  string
	GRTEmail     string
	Requester    string
	Reason       string
	NextSteps    string
	Feedback     string
	DecisionLink string
}

func (c Client) rejectRequestBody(
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	reason string,
	nextSteps string,
	feedback string,
) (string, error) {
	decisionPath := path.Join("governance-task-list", systemIntakeID.String(), "request-decision")
	data := rejectRequest{
		ProjectName:  projectName,
		GRTEmail:     string(c.config.GRTEmail),
		Requester:    requester,
		Reason:       reason,
		NextSteps:    nextSteps,
		Feedback:     feedback,
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

// SendRejectRequestEmail sends an email for rejecting a request
// TODO - EASI-2021 - remove
func (c Client) SendRejectRequestEmail(
	ctx context.Context,
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	recipient models.EmailAddress,
	reason string,
	nextSteps string,
	feedback string,
) error {
	subject := "Request in EASi not approved"
	body, err := c.rejectRequestBody(systemIntakeID, projectName, requester, reason, nextSteps, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		[]models.EmailAddress{recipient},
		[]models.EmailAddress{c.config.GRTEmail},
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}

// SendRejectRequestEmailToMultipleRecipients sends emails to multiple recipients (possibly including the IT Governance and IT Investment teams) for rejecting a request
// TODO - EASI-2021 - rename to SendRejectRequestEmails
func (c Client) SendRejectRequestEmailToMultipleRecipients(
	ctx context.Context,
	systemIntakeID uuid.UUID,
	projectName string,
	requester string,
	recipients models.EmailNotificationRecipients,
	reason string,
	nextSteps string,
	feedback string,
) error {
	subject := "Request in EASi not approved"
	body, err := c.rejectRequestBody(systemIntakeID, projectName, requester, reason, nextSteps, feedback)
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
