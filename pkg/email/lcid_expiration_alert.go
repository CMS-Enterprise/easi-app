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

type lcidExperationAlert struct {
	RequestName    string
	ExpirationDate string
	GRTEmail       string
	DecisionLink   string
}

func (c Client) lcidExpirationBody(ctx context.Context, systemIntakeID uuid.UUID, requestName string, lcidExpirationDate *time.Time) (string, error) {
	decisionPath := path.Join("governance-review-team", systemIntakeID.String(), "decision")
	data := lcidExperationAlert{
		RequestName:    requestName,
		ExpirationDate: lcidExpirationDate.Format("January 2, 2006"),
		GRTEmail:       string(c.config.GRTEmail),
		DecisionLink:   decisionPath,
	}

	var b bytes.Buffer
	if c.templates.lcidExpirationAlertTemplate == nil {
		return "", errors.New("LCID expiration alert template is nil")
	}

	err := c.templates.lcidExpirationAlertTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendLCIDExpirationAlertEmail sends an email to the governance mailbox notifying them about LCID that is expiring soon
func (c Client) SendLCIDExpirationAlertEmail(ctx context.Context, requestName string, lcidExpirationDate *time.Time, systemIntakeID uuid.UUID) error {
	subject := "Lifecycle ID about to expire"
	body, err := c.lcidExpirationBody(ctx, systemIntakeID, requestName, lcidExpirationDate)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		[]models.EmailAddress{c.config.GRTEmail},
		nil,
		subject,
		body,
	)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
