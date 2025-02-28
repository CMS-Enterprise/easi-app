package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type systemIntakePresentationDeckUploadReminderParameters struct {
	ProjectTitle             string
	SystemIntakeRequestLink  string
	ITGovernanceInboxAddress string
	GRBHelpLink              string
}

func (sie systemIntakeEmails) presentationDeckUploadReminderBody(
	systemIntakeID uuid.UUID,
	projectTitle string,
) (string, error) {
	requesterURL := sie.client.urlFromPath(path.Join("governance-task-list", systemIntakeID.String()))

	data := systemIntakePresentationDeckUploadReminderParameters{
		ProjectTitle:             projectTitle,
		SystemIntakeRequestLink:  requesterURL,
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		GRBHelpLink:              sie.client.urlFromPath(path.Join("help", "grb", "prepare-presentation-deck")), // TODO: Get proper path
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakePresentationDeckUploadReminder == nil {
		return "", errors.New("presentation deck upload reminder email template is nil")
	}
	err := sie.client.templates.systemIntakePresentationDeckUploadReminder.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendPresentationDeckUploadReminder sends an email to the requesters of a system intake to remind them to upload the presentation deck
func (sie systemIntakeEmails) SendPresentationDeckUploadReminder(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectTitle string,
) error {
	subject := fmt.Sprintf("GRB review started for %s", projectTitle)
	body, err := sie.presentationDeckUploadReminderBody(systemIntakeID, projectTitle)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(sie.client.listAllRecipients(recipients)).
			WithSubject(subject).
			WithBody(body),
	)
}
