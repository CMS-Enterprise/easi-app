package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type newAccessibilityRequest struct {
	RequesterName   string
	RequestName     string
	ApplicationName string
	RequestLink     string
}

type newAccessibilityRequestEmailToRequester struct {
	RequestName            string
	RequestLink            string
	TemplatesLink          string
	AccessibilityTeamEmail models.EmailAddress
}

func (c Client) newAccessibilityRequestBody(requesterName, requestName, applicationName string, requestID uuid.UUID) (string, error) {
	requestPath := path.Join("508", "requests", requestID.String())
	data := newAccessibilityRequest{
		RequesterName:   requesterName,
		RequestName:     requestName,
		ApplicationName: applicationName,
		RequestLink:     c.urlFromPath(requestPath),
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

func (c Client) newAccessibilityRequestToRequesterBody(requestName string, requestID uuid.UUID) (string, error) {
	requestPath := path.Join("508", "requests", requestID.String())
	templatesPath := path.Join("508", "templates")
	data := newAccessibilityRequestEmailToRequester{
		RequestName:            requestName,
		RequestLink:            c.urlFromPath(requestPath),
		TemplatesLink:          c.urlFromPath(templatesPath),
		AccessibilityTeamEmail: c.config.AccessibilityTeamEmail,
	}
	var b bytes.Buffer
	if c.templates.newAccessibilityRequestToRequesterTemplate == nil {
		return "", errors.New("email template is nil")
	}
	err := c.templates.newAccessibilityRequestToRequesterTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendNewAccessibilityRequestEmail sends an email for a new 508 request
func (c Client) SendNewAccessibilityRequestEmail(ctx context.Context, requesterName, requestName, applicationName string, requestID uuid.UUID) error {
	subject := fmt.Sprintf("There's a new 508 request: %s", requestName)
	body, err := c.newAccessibilityRequestBody(requesterName, requestName, applicationName, requestID)
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

// SendNewAccessibilityRequestEmailToRequester sends an email to the requester for a new 508 request
func (c Client) SendNewAccessibilityRequestEmailToRequester(ctx context.Context, requestName string, requestID uuid.UUID, requesterEmail models.EmailAddress) error {
	subject := fmt.Sprintf("508 testing request: %s was received", requestName)
	body, err := c.newAccessibilityRequestToRequesterBody(requestName, requestID)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		requesterEmail,
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
