package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type systemIntakeRequestEditsEmailParameters struct {
	RequestName              string
	RequesterName            string
	Feedback                 template.HTML
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) requestEditsBody(
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	feedback models.HTML,
) (string, error) {
	// taskListPath := path.Join("governance-task-list", systemIntakeID.String())

	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("governance-review-team", systemIntakeID.String())

	data := systemIntakeRequestEditsEmailParameters{
		RequestName:              requestName,
		RequesterName:            requesterName,
		Feedback:                 feedback.ToTemplate(),
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeRequestEdits == nil {
		return "", errors.New("request edits email template is nil")
	}
	err := sie.client.templates.systemIntakeRequestEdits.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendRequestEditsNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendRequestEditsNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	formName string,
	requestName string,
	requesterName string,
	feedback models.HTML,
) error {

	subject := fmt.Sprintf("Updates requested for the %s for %s", formName, requestName) //TODO: SW implement this, perhaps as a subject template? Or just create it here?
	body, err := sie.requestEditsBody(systemIntakeID, requestName, requesterName, feedback)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = sie.client.sender.Send(
		ctx,
		sie.client.listAllRecipients(recipients),
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
