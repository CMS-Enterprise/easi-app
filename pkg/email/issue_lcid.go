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

// SendIssueLCIDEmail sends an email to a single recipient (CC'ing the GRT) for issuing an LCID
// TODO - EASI-2021 - remove
func (c Client) SendIssueLCIDEmail(
	ctx context.Context,
	recipient models.EmailAddress,
	lcid string,
	expirationDate *time.Time,
	scope string,
	lifecycleCostBaseline string,
	nextSteps string,
	feedback string,
) error {
	subject := "Your request has been approved"
	body, err := c.issueLCIDBody(lcid, expirationDate, scope, lifecycleCostBaseline, nextSteps, feedback)
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

// SendIssueLCIDEmailToMultipleRecipients sends an email to multiple recipients (possibly including the IT Governance and IT Investment teams) for issuing an LCID
// TODO - EASI-2021 - rename to SendIssueLCIDEmails
func (c Client) SendIssueLCIDEmailToMultipleRecipients(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lcid string,
	expirationDate *time.Time,
	scope string,
	lifecycleCostBaseline string,
	nextSteps string,
	feedback string,
) error {
	subject := "Your request has been approved"
	body, err := c.issueLCIDBody(lcid, expirationDate, scope, lifecycleCostBaseline, nextSteps, feedback)
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
