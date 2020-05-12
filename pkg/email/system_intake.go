package email

import (
	"bytes"
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
	intakePath := path.Join("system", intakeID.String(), "grt-review")
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
func (c Client) SendSystemIntakeSubmissionEmail(requester string, intakeID uuid.UUID) error {
	subject := fmt.Sprintf("New intake request: %s", requester)
	body, err := c.systemIntakeSubmissionBody(intakeID)
	if err != nil {
		return &apperrors.NotificationError{Err: err, Destination: apperrors.DestinationEmail}
	}
	err = c.sender.Send(
		c.config.GRTEmail,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, Destination: apperrors.DestinationEmail}
	}
	return nil
}
