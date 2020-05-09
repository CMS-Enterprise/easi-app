package appses

import (
	"fmt"
	"path"

	"github.com/google/uuid"
)

func (c Client) systemIntakeSubmissionBody(intakeID uuid.UUID) string {
	intakePath := path.Join("intake", intakeID.String())
	link := c.htmlLink(
		intakePath,
		"Open intake request in EASi",
	)
	return "Hello,<br>" +
		"You have a new intake request pending in EASi. " +
		"Please get back to the requester as soon as possible with your response.<br><br>" +
		link
}

func (c Client) systemIntakeSubmissionSubject(requester string) string {
	return fmt.Sprintf("New intake request: %s", requester)
}

// SendSystemIntakeSubmissionEmail sends an email for a submitted system intake
func (c Client) SendSystemIntakeSubmissionEmail(requester string, intakeID uuid.UUID) error {
	_, err := c.sendEmail(
		c.config.GRTEmail,
		c.systemIntakeSubmissionSubject(requester),
		c.systemIntakeSubmissionBody(intakeID),
	)
	if err != nil {
		return err
	}
	return nil
}
