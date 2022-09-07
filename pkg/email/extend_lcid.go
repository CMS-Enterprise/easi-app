package email

import (
	"bytes"
	"context"
	"errors"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type extendLCID struct {
	RequestName     string
	NewExpiresAt    string
	NewScope        string
	NewNextSteps    string
	NewCostBaseline string
	DecisionLink    string
}

func (c Client) extendLCIDBody(systemIntakeID uuid.UUID, requestName string, newExpiresAt *time.Time, newScope string, newNextSteps string, newCostBaseline string) (string, error) {
	decisionPath := path.Join("governance-task-list", systemIntakeID.String(), "request-decision")
	data := extendLCID{
		RequestName:     requestName,
		NewExpiresAt:    newExpiresAt.Format("January 2, 2006"),
		NewScope:        newScope,
		NewNextSteps:    newNextSteps,
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

// SendExtendLCIDEmail sends an email to a single recipient for extending an LCID
// TODO - EASI-2021 - remove
func (c Client) SendExtendLCIDEmail(
	ctx context.Context,
	recipient models.EmailAddress,
	systemIntakeID uuid.UUID,
	requestName string,
	newExpiresAt *time.Time,
	newScope string,
	newNextSteps string,
	newCostBaseline string,
) error {
	subject := "Lifecycle ID Extended"
	body, err := c.extendLCIDBody(systemIntakeID, requestName, newExpiresAt, newScope, newNextSteps, newCostBaseline)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		[]models.EmailAddress{recipient},
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}

// SendExtendLCIDEmailToMultipleRecipients sends an email to multiple recipients (possibly including the IT Governance and IT Investment teams) for extending an LCID
//
//	TODO - EASI-2021 - rename to SendExtendLCIDEmails
func (c Client) SendExtendLCIDEmailToMultipleRecipients(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	requestName string,
	newExpiresAt *time.Time,
	newScope string,
	newNextSteps string,
	newCostBaseline string,
) error {
	subject := "Lifecycle ID Extended"
	body, err := c.extendLCIDBody(systemIntakeID, requestName, newExpiresAt, newScope, newNextSteps, newCostBaseline)
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
