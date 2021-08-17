package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type removedAccessibilityRequest struct {
	RequestName  string
	RemoverName  string
	Reason       string
	RemoverEmail string
}

func convertRemovalReasonToReadableString(reason models.AccessibilityRequestDeletionReason) string {
	switch reason {
	case models.AccessibilityRequestDeletionReasonIncorrectApplicationAndLifecycleID:
		return "Incorrect application and Lifecycle ID selected"
	case models.AccessibilityRequestDeletionReasonNoTestingNeeded:
		return "No testing needed"
	case models.AccessibilityRequestDeletionReasonOther:
		return "Other"
	default:
		return ""
	}
}

func (c Client) removedAccessibilityRequestBody(requestName, removerName string, reason models.AccessibilityRequestDeletionReason, removerEmail models.EmailAddress) (string, error) {
	data := removedAccessibilityRequest{
		RemoverName:  removerName,
		RequestName:  requestName,
		Reason:       convertRemovalReasonToReadableString(reason),
		RemoverEmail: removerEmail.String(),
	}
	var b bytes.Buffer
	if c.templates.removedAccessibilityRequestTemplate == nil {
		return "", errors.New("email template is nil")
	}
	err := c.templates.removedAccessibilityRequestTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendRemovedAccessibilityRequestEmail sends an email for a removed 508 request
func (c Client) SendRemovedAccessibilityRequestEmail(
	ctx context.Context,
	requestName,
	removerName string,
	reason models.AccessibilityRequestDeletionReason,
	removerEmail models.EmailAddress,
) error {
	subject := fmt.Sprintf("%s request removed by %s", requestName, removerName)
	body, err := c.removedAccessibilityRequestBody(requestName, removerName, reason, removerEmail)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		c.config.AccessibilityTeamEmail,
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
