package email

import (
	"bytes"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type businessCaseSubmission struct {
	BusinessCaseLink string
}

func (c Client) businessCaseSubmissionBody(businessCaseID uuid.UUID) (string, error) {
	businessCasePath := path.Join("business", businessCaseID.String(), "grt-review")
	data := businessCaseSubmission{
		BusinessCaseLink: c.urlFromPath(businessCasePath),
	}
	var b bytes.Buffer
	if c.templates.businessCaseSubmissionTemplate == nil {
		return "", errors.New("business case submission template is nil")
	}
	err := c.templates.businessCaseSubmissionTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendBusinessCaseSubmissionEmail sends an email for a submitted business case
func (c Client) SendBusinessCaseSubmissionEmail(requester string, businessCaseID uuid.UUID) error {
	subject := fmt.Sprintf("New Business Case: %s", requester)
	body, err := c.businessCaseSubmissionBody(businessCaseID)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		c.config.GRTEmail,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
