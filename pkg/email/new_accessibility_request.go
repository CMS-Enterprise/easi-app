package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type newAccessibilityRequest struct {
	RequesterName   string
	RequestName     string
	ApplicationName string
	RequestLink     string
}

func (c Client) newAccessibilityRequestBody(requesterName, requestName, applicationName, requestLink string) (string, error) {
	data := newAccessibilityRequest{
		RequesterName:   requesterName,
		RequestName:     requestName,
		ApplicationName: applicationName,
		RequestLink:     requestLink,
	}
	var b bytes.Buffer
	if c.templates.newAccessibilityRequestTemplate == nil {
		return "", errors.New("email template is nil")
	}
	err := c.templates.newAccessibilityRequestTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendNewAccessibilityRequestEmail sends an email for a new 508 request
func (c Client) SendNewAccessibilityRequestEmail(ctx context.Context, requesterName, requestName, applicationName, requestLink string) error {
	subject := fmt.Sprintf("There's a new 508 request: %s", requestName)
	body, err := c.newAccessibilityRequestBody(requesterName, requestName, applicationName, requestLink)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		c.config.AccessibilityTeamEmail,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
