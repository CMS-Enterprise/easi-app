package email

import (
	"bytes"
	"context"
	"errors"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type issueLCID struct {
	LifecycleID           string
	ExpiresAt             string
	Scope                 string
	LifecycleCostBaseline string
	NextSteps             string
	Feedback              string
}

func (c Client) issueLCIDBody(lcid string, expiresAt *time.Time, scope string, lifecycleCostBaseline string, nextSteps string, feedback string) (string, error) {
	data := issueLCID{
		LifecycleID:           lcid,
		ExpiresAt:             expiresAt.Format("January 2, 2006"),
		Scope:                 scope,
		LifecycleCostBaseline: lifecycleCostBaseline,
		NextSteps:             nextSteps,
		Feedback:              feedback,
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

// SendIssueLCIDEmail sends an email to a single recipient (CC'ing the GRT) for issuing an LCID
// TODO - EASI-2021 - remove
func (c Client) SendIssueLCIDEmail(
	ctx context.Context,
	recipient models.EmailAddress,
	lcid string,
	expirationDate *time.Time,
	scope string,
	lifecycleCostBaseline string,
	nextSteps string,
	feedback string,
) error {
	subject := "Lifecycle ID request approved"
	body, err := c.issueLCIDBody(lcid, expirationDate, scope, lifecycleCostBaseline, nextSteps, feedback)
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

// SendIssueLCIDEmailToMultipleRecipients sends an email to multiple recipients (possibly including the IT Governance and IT Investment teams) for issuing an LCID
// TODO - EASI-2021 - rename to SendIssueLCIDEmails
func (c Client) SendIssueLCIDEmailToMultipleRecipients(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lcid string,
	expirationDate *time.Time,
	scope string,
	lifecycleCostBaseline string,
	nextSteps string,
	feedback string,
) error {
	subject := "Lifecycle ID request approved"
	body, err := c.issueLCIDBody(lcid, expirationDate, scope, lifecycleCostBaseline, nextSteps, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return c.sendEmailToMultipleRecipients(ctx, recipients, subject, body)
}
