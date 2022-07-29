package email

import (
	"bytes"
	"context"
	"errors"
	"path"

	"github.com/google/uuid"
	"github.com/hashicorp/go-multierror"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type intakeReview struct {
	EmailText    string
	TaskListPath string
}

func (c Client) systemIntakeReviewBody(emailText string, taskListPath string) (string, error) {
	data := intakeReview{
		EmailText:    emailText,
		TaskListPath: c.urlFromPath(taskListPath),
	}
	var b bytes.Buffer
	if c.templates.intakeReviewTemplate == nil {
		return "", errors.New("system intake review template is nil")
	}
	err := c.templates.intakeReviewTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSystemIntakeReviewEmail sends an email for a submitted system intake
// TODO - EASI-2021 - remove
func (c Client) SendSystemIntakeReviewEmail(ctx context.Context, emailText string, recipientAddress models.EmailAddress, intakeID uuid.UUID) error {
	subject := "Feedback on your intake request"
	taskListPath := path.Join("governance-task-list", intakeID.String())
	body, err := c.systemIntakeReviewBody(emailText, taskListPath)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		recipientAddress,
		&c.config.GRTEmail,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}

// SendSystemIntakeReviewEmailToMultipleRecipients sends emails to multiple recipients (possibly including the IT Governance and IT Investment teams) about GRT review on a submitted system intake
// TODO - EASI-2021 - rename to SendSystemIntakeReviewEmails
func (c Client) SendSystemIntakeReviewEmailToMultipleRecipients(
	ctx context.Context,
	emailText string,
	recipients models.EmailNotificationRecipients,
	intakeID uuid.UUID,
) error {
	subject := "Feedback on your intake request"
	taskListPath := path.Join("governance-task-list", intakeID.String())
	body, err := c.systemIntakeReviewBody(emailText, taskListPath)
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

	errorGroup := multierror.Group{}
	for _, recipient := range allRecipients {
		// make a copy of recipient for the closure passed in to errorGroup.Go(); this copy won't change as we iterate over allRecipients
		// see https://go.dev/doc/faq#closures_and_goroutines
		recipient := recipient

		errorGroup.Go(func() error {
			// make sure to use := here to create a new (local) err, instead of reusing the same err across goroutines
			err := c.sender.Send(
				ctx,
				recipient,
				nil,
				subject,
				body,
			)
			if err != nil {
				return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
			}
			return nil
		})
	}

	return errorGroup.Wait().ErrorOrNil()
}
