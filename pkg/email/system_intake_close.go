package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type systemIntakeCloseRequestEmailParameters struct {
	RequestName              string
	RequesterName            string
	Reason                   template.HTML
	SubmittedAt              string
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) closeRequestBody(
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason *models.HTML,
	submittedAt *time.Time,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("it-governance", systemIntakeID.String(), "intake-request")

	var submissionDate string
	if submittedAt != nil {
		submissionDate = submittedAt.Format("01/02/2006")
	}

	data := systemIntakeCloseRequestEmailParameters{
		RequestName:              requestName,
		RequesterName:            requesterName,
		Reason:                   reason.ToTemplate(),
		SubmittedAt:              submissionDate,
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeCloseRequest == nil {
		return "", errors.New("close request email template is nil")
	}
	err := sie.client.templates.systemIntakeCloseRequest.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendCloseRequestNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendCloseRequestNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason *models.HTML,
	submittedAt *time.Time,
	additionalInfo *models.HTML,
) error {
	if requestName == "" {
		requestName = "Draft System Intake"
	}
	subject := fmt.Sprintf("The Governance Team has closed %s in EASi", requestName)
	body, err := sie.closeRequestBody(systemIntakeID, requestName, requesterName, reason, submittedAt, additionalInfo)
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
