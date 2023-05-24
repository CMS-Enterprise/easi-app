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

type readyForConsultEmailParameters struct {
	RequestName         string
	RequesterName       string
	Feedback            string
	TRBRequestLink      string
	TRBAdminRequestLink string
	TRBInboxAddress     string
}

func (c Client) trbReadyForConsultEmailBody(requestID uuid.UUID, requestName string, requesterName string, feedback string) (string, error) {
	requestTaskListPath := path.Join("trb", "task-list", requestID.String())

	requestAdminViewPath := path.Join("trb", requestID.String(), "request")

	data := readyForConsultEmailParameters{
		RequestName:         requestName,
		RequesterName:       requesterName,
		Feedback:            feedback,
		TRBRequestLink:      c.urlFromPath(requestTaskListPath),
		TRBAdminRequestLink: c.urlFromPath(requestAdminViewPath),
		TRBInboxAddress:     c.config.TRBEmail.String(),
	}

	var b bytes.Buffer
	if c.templates.trbReadyForConsult == nil {
		return "", errors.New("TRB Ready for Consult template is nil")
	}

	err := c.templates.trbReadyForConsult.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendTRBReadyForConsultNotification notifies user-selected recipients that a TRB request is ready for its consult session
func (c Client) SendTRBReadyForConsultNotification(
	ctx context.Context,
	recipients []models.EmailAddress,
	copyTRBMailbox bool,
	requestID uuid.UUID,
	requestName string,
	requesterName string,
	feedback string,
) error {
	subject := fmt.Sprintf("%v is ready for a consult session", requestName)
	body, err := c.trbReadyForConsultEmailBody(requestID, requestName, requesterName, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	allRecipients := recipients
	if copyTRBMailbox {
		allRecipients = append(allRecipients, c.config.TRBEmail)
	}

	err = c.sender.Send(
		ctx,
		allRecipients,
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
