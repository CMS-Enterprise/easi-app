package email

import (
	"bytes"
	"context"
	"errors"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/hashicorp/go-multierror"
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

// SendIssueLCIDEmail sends an email for issuing an LCID
func (c Client) SendIssueLCIDEmail(ctx context.Context, recipients []models.EmailAddress, lcid string, expirationDate *time.Time, scope string, lifecycleCostBaseline string, nextSteps string, feedback string) error {
	subject := "Your request has been approved"
	body, err := c.issueLCIDBody(lcid, expirationDate, scope, lifecycleCostBaseline, nextSteps, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	var errors *multierror.Error

	for _, recipient := range recipients {
		err = c.sender.Send(
			ctx,
			recipient,
			&c.config.GRTEmail,
			subject,
			body,
		)
		if err != nil {
			notificationErr := &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
			errors = multierror.Append(errors, notificationErr)
		}
	}

	return errors.ErrorOrNil()
}
