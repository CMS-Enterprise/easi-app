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

type readyForConsultEmailParameters struct {
	RequestName         string
	RequesterName       string
	Feedback            template.HTML // This allows unescaped HTML //TODO! make sure to sanitize it! // https://pkg.go.dev/html/template
	TRBRequestLink      string
	TRBAdminRequestLink string
	TRBInboxAddress     string
}

func (c Client) trbReadyForConsultEmailBody(requestID uuid.UUID, requestName string, requesterName string, feedback models.HTML) (string, error) {
	requestTaskListPath := path.Join("trb", "task-list", requestID.String())

	requestAdminViewPath := path.Join("trb", requestID.String(), "request")

	//TODO, should we use template.HTML earlier instead of converting here? We can use that instead of models.HTML potentially
	data := readyForConsultEmailParameters{
		RequestName:         requestName,
		RequesterName:       requesterName,
		Feedback:            feedback.ToTemplate(),
		TRBRequestLink:      c.urlFromPath(requestTaskListPath),
		TRBAdminRequestLink: c.urlFromPath(requestAdminViewPath),
		TRBInboxAddress:     c.config.TRBEmail.String(),
	}

	var b bytes.Buffer
	if c.templates.trbReadyForConsult == nil {
		return "", errors.New("TRB Ready for Consult template is nil")
	}

	// c.templates.trbReadyForConsult
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
	feedback models.HTML, //TODO make this accept rich text
) error {
	subject := fmt.Sprintf("%v is ready for a consult session", requestName)
	body, err := c.trbReadyForConsultEmailBody(requestID, requestName, requesterName, feedback)
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
