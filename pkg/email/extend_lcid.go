package email

import (
	"bytes"
	"context"
	"errors"
	"time"
	"path"
	"uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)


type extendLCID struct {
	RequestName string
	NewExpiresAt string
	DecisionLink string
}

func (c Client) extendLCIDBody(systemIntakeID uuid.UUID, requestName string, newExpiresAt *time.Time) (string, error) {
	decisionPath := path.Join("governance-task-list", systemIntakeID.String(),  "request-decision")
	data := extendLCID{
		RequestName: requestName,
		NewExpiresAt: newExpiresAt.Format("January 2, 2006"),
		DecisionLink: c.urlFromPath(decisionPath),
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

func (c Client) SendExtendLCIDEmail(ctx context.Context, recipient models.EmailAddress, systemIntakeID uuid.UUID, requestName string, newExpiresAt *time.Time) error {
	subject := "Lifecycle ID expiration date extended"
	body, err := c.extendLCIDBody(systemIntakeID, requestName, newExpiresAt)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		recipient,
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
