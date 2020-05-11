package email

import (
	"bytes"
	"fmt"
	"path"

	"github.com/google/uuid"
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
	err := c.templates.systemIntakeSubmissionTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

func (c Client) systemIntakeSubmissionSubject(requester string) string {
	return fmt.Sprintf("New intake request: %s", requester)
}

// SendSystemIntakeSubmissionEmail sends an email for a submitted system intake
func (c Client) SendSystemIntakeSubmissionEmail(requester string, intakeID uuid.UUID) error {
	body, err := c.systemIntakeSubmissionBody(intakeID)
	if err != nil {
		return err
	}
	err = c.sender.Send(
		c.config.GRTEmail,
		c.systemIntakeSubmissionSubject(requester),
		body,
	)
	if err != nil {
		return err
	}
	return nil
}
