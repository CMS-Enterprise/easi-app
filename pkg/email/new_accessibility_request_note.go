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

type newAccessibilityRequestNote struct {
	RequestName string
	CreatorName string
	RequestLink string
}

func (c Client) newAccessibilityRequestNoteBody(requestID uuid.UUID, requestName, creatorName string) (string, error) {
	requestPath := path.Join("508", "requests", requestID.String())
	data := newAccessibilityRequestNote{
		CreatorName: creatorName,
		RequestName: requestName,
		RequestLink: c.urlFromPath(requestPath),
	}
	var b bytes.Buffer
	if c.templates.newAccessibilityRequestNote == nil {
		return "", errors.New("email template is nil")
	}
	err := c.templates.newAccessibilityRequestNote.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendNewAccessibilityRequestNoteEmail sends an email for a new 508 note
func (c Client) SendNewAccessibilityRequestNoteEmail(
	ctx context.Context,
	requestID uuid.UUID,
	requestName,
	creatorName string,
) error {
	subject := fmt.Sprintf("%s: New note added", requestName)
	body, err := c.newAccessibilityRequestNoteBody(requestID, requestName, creatorName)
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
