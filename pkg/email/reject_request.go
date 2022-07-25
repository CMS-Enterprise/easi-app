package email

import (
	"bytes"
	"context"
	"errors"

	"github.com/hashicorp/go-multierror"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type rejectRequest struct {
	Reason    string
	NextSteps string
	Feedback  string
}

func (c Client) rejectRequestBody(reason string, nextSteps string, feedback string) (string, error) {
	data := rejectRequest{
		Reason:    reason,
		NextSteps: nextSteps,
		Feedback:  feedback,
	}
	var b bytes.Buffer
	if c.templates.rejectRequestTemplate == nil {
		return "", errors.New("reject request template is nil")
	}
	err := c.templates.rejectRequestTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendRejectRequestEmail sends an email for rejecting a request
// TODO - EASI-2021 - remove
func (c Client) SendRejectRequestEmail(ctx context.Context, recipient models.EmailAddress, reason string, nextSteps string, feedback string) error {
	subject := "Your request has not been approved"
	body, err := c.rejectRequestBody(reason, nextSteps, feedback)
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

// SendRejectRequestEmailToMultipleRecipients sends emails to multiple recipients (possibly including the IT Governance and IT Investment teams) for rejecting a request
// TODO - EASI-2021 - rename to SendRejectRequestEmails
func (c Client) SendRejectRequestEmailToMultipleRecipients(ctx context.Context, recipients models.EmailNotificationRecipients, reason string, nextSteps string, feedback string) error {
	subject := "Your request has not been approved"
	body, err := c.rejectRequestBody(reason, nextSteps, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	allRecipients := recipients.RegularRecipientEmails
	if recipients.ShouldNotifyITGovernance {
		allRecipients = append(allRecipients, c.config.GRTEmail)
	}

	if recipients.ShouldNotifyITInvestment {
		allRecipients = append(allRecipients, c.config.ITInvestmentEmail)
	}

	var errors *multierror.Error

	for _, recipient := range allRecipients {
		err = c.sender.Send(
			ctx,
			recipient,
			nil,
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
