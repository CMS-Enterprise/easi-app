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

type systemIntakeRequestEditsEmailParameters struct {
	RequestName              string
	FormName                 string
	RequesterName            string
	Feedback                 template.HTML
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) requestEditsBody(
	systemIntakeID uuid.UUID,
	requestName string,
	formName models.GovernanceRequestFeedbackTargetForm,
	requesterName string,
	feedback models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	var adminFormPath string
	switch formName {
	case models.GRFTFIntakeRequest:
		adminFormPath = "intake-request"
	case models.GRFTFDraftBusinessCase:
		fallthrough
	case models.GRFTFinalBusinessCase:
		adminFormPath = "business-case"
	case models.GRFTFNoTargetProvided:
		return "", errors.New("no target form provided")
	}
	adminPath := path.Join("governance-review-team", systemIntakeID.String(), adminFormPath)

	data := systemIntakeRequestEditsEmailParameters{
		RequestName:              requestName,
		FormName:                 formName.Humanize(),
		RequesterName:            requesterName,
		Feedback:                 feedback.ToTemplate(),
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
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
	formName models.GovernanceRequestFeedbackTargetForm,
	requestName string,
	requesterName string,
	feedback models.HTML,
	additionalInfo *models.HTML,
) error {

	if requestName == "" {
		requestName = "Draft System Intake"
	}
	subject := fmt.Sprintf("Updates requested for the %s for %s", formName.Humanize(), requestName)
	body, err := sie.requestEditsBody(systemIntakeID, requestName, formName, requesterName, feedback, additionalInfo)
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
