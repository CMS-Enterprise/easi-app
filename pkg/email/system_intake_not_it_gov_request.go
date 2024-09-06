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

type systemIntakeNotITGovRequestEmailParameters struct {
	RequestName              string
	RequesterName            string
	Reason                   template.HTML
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) SystemIntakeNotITGovRequestBody(
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason *models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("it-governance", systemIntakeID.String(), "intake-request")

	data := systemIntakeNotITGovRequestEmailParameters{
		RequestName:              requestName,
		RequesterName:            requesterName,
		Reason:                   reason.ToTemplate(),
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeNotITGovRequest == nil {
		return "", errors.New("not it gov request email template is nil")
	}
	err := sie.client.templates.systemIntakeNotITGovRequest.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendNotITGovRequestNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendNotITGovRequestNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason *models.HTML,
	additionalInfo *models.HTML,
) error {
	if requestName == "" {
		requestName = "Draft System Intake"
	}
	subject := fmt.Sprintf("%s is not an IT Governance request", requestName)
	body, err := sie.SystemIntakeNotITGovRequestBody(systemIntakeID, requestName, requesterName, reason, additionalInfo)
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
