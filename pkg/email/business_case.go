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

type businessCaseSubmission struct {
	BusinessCaseLink string
	RequestName      string
}

func (c Client) businessCaseSubmissionBody(systemIntakeID uuid.UUID, requestName string) (string, error) {
	businessCasePath := path.Join("governance-review-team", systemIntakeID.String(), "business-case")
	data := businessCaseSubmission{
		BusinessCaseLink: c.urlFromPath(businessCasePath),
		RequestName:      requestName,
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
func (c Client) SendBusinessCaseSubmissionEmail(ctx context.Context, requestName string, systemIntakeID uuid.UUID) error {
	// TODO: maybe we should check if intake status is DRAFT and format accordingly (i.e. New Biz Case vs New Draft Biz Case)
	//       similar to how request_withdraw checks if it is an unnamed request
	subject := fmt.Sprintf("New Business Case: %s", requestName)
	body, err := c.businessCaseSubmissionBody(systemIntakeID, requestName)
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
