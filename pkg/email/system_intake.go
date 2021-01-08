package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type systemIntakeSubmission struct {
	IntakeLink string
}

func (c Client) systemIntakeSubmissionBody(intakeID uuid.UUID) (string, error) {
	intakePath := path.Join("governance-review-team", intakeID.String(), "intake-request")
	data := systemIntakeSubmission{
		IntakeLink: c.urlFromPath(intakePath),
	}
	var b bytes.Buffer
	if c.templates.systemIntakeSubmissionTemplate == nil {
		return "", errors.New("system intake submission template is nil")
	}
	err := c.templates.systemIntakeSubmissionTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSystemIntakeSubmissionEmail sends an email for a submitted system intake
func (c Client) SendSystemIntakeSubmissionEmail(ctx context.Context, requester string, intakeID uuid.UUID) error {
	subject := fmt.Sprintf("New intake request: %s", requester)
	body, err := c.systemIntakeSubmissionBody(intakeID)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		c.config.GRTEmail,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
