package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type editsOnFormRequestedEmailParameters struct {
	RequestName         string
	RequesterName       string
	Feedback            template.HTML
	TRBRequestLink      string
	TRBAdminRequestLink string
	TRBInboxAddress     string
}

func (c Client) trbEditsOnFormRequestedEmailBody(requestID uuid.UUID, requestName string, requesterName string, feedback models.HTML) (string, error) {
	requestTaskListPath := path.Join("trb", "task-list", requestID.String())

	requestAdminViewPath := path.Join("trb", requestID.String(), "request")

	data := editsOnFormRequestedEmailParameters{
		RequestName:         requestName,
		RequesterName:       requesterName,
		Feedback:            feedback.ToTemplate(),
		TRBRequestLink:      c.urlFromPath(requestTaskListPath),
		TRBAdminRequestLink: c.urlFromPath(requestAdminViewPath),
		TRBInboxAddress:     c.config.TRBEmail.String(),
	}

	var b bytes.Buffer
	if c.templates.trbEditsNeededOnForm == nil {
		return "", errors.New("TRB Edits Needed on Form template is nil")
	}

	err := c.templates.trbEditsNeededOnForm.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendTRBEditsNeededOnFormNotification notifies user-selected recipients that a TRB request form needs edits
func (c Client) SendTRBEditsNeededOnFormNotification(
	ctx context.Context,
	recipients []models.EmailAddress,
	copyTRBMailbox bool,
	requestID uuid.UUID,
	requestName string,
	requesterName string,
	feedback models.HTML,
) error {
	subject := fmt.Sprintf("The TRB has requested edits for %v", requestName)
	body, err := c.trbEditsOnFormRequestedEmailBody(requestID, requestName, requesterName, feedback)
	if err != nil {
		return err
	}

	allRecipients := recipients
	if copyTRBMailbox {
		allRecipients = append(allRecipients, c.config.TRBEmail)
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(allRecipients).
			WithSubject(subject).
			WithBody(body),
	)
}
