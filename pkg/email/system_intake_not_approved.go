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

type systemIntakeNotApprovedEmailParameters struct {
	RequestName              string
	RequesterName            string
	Reason                   template.HTML
	NextSteps                template.HTML
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) systemIntakeNotApprovedBody(
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason models.HTML,
	nextSteps models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("it-governance", systemIntakeID.String(), "intake-request")

	data := systemIntakeNotApprovedEmailParameters{
		RequestName:              requestName,
		RequesterName:            requesterName,
		Reason:                   reason.ToTemplate(),
		NextSteps:                nextSteps.ToTemplate(),
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeNotApproved == nil {
		return "", errors.New("request not approved email template is nil")
	}
	err := sie.client.templates.systemIntakeNotApproved.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendNotApprovedNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendNotApprovedNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason models.HTML,
	nextSteps models.HTML,
	additionalInfo *models.HTML,
) error {
	if requestName == "" {
		requestName = "Draft System Intake"
	}
	subject := fmt.Sprintf("%s was not approved by the GRB", requestName)
	body, err := sie.systemIntakeNotApprovedBody(systemIntakeID, requestName, requesterName, reason, nextSteps, additionalInfo)
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
