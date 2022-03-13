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
	LifecycleID string
	ExpiresAt   string
	Scope       string
	NextSteps   string
	Feedback    string
}

func (c Client) issueLCIDBody(lcid string, expiresAt *time.Time, scope string, nextSteps string, feedback string) (string, error) {
	data := issueLCID{
		LifecycleID: lcid,
		ExpiresAt:   expiresAt.Format("January 2, 2006"),
		Scope:       scope,
		NextSteps:   nextSteps,
		Feedback:    feedback,
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

// SendIssueLCIDEmail sends an email for issuing an LCID
func (c Client) SendIssueLCIDEmail(ctx context.Context, recipient models.EmailAddress, lcid string, expirationDate *time.Time, scope string, nextSteps string, feedback string) error {
	subject := "Your request has been approved"
	body, err := c.issueLCIDBody(lcid, expirationDate, scope, nextSteps, feedback)
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
