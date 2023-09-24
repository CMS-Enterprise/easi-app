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

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type systemIntakeReopenRequestEmailParameters struct {
	RequestName              string
	RequesterName            string
	Reason                   template.HTML
	SubmittedAt              string
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) reopenRequestBody(
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason models.HTML,
	submittedAt *time.Time,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("governance-review-team", systemIntakeID.String(), "intake-request")

	var submissionDate string
	if submittedAt != nil {
		submissionDate = submittedAt.Format("01/02/2006")
	}

	data := systemIntakeReopenRequestEmailParameters{
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
	if sie.client.templates.systemIntakeReopenRequest == nil {
		return "", errors.New("reopen request email template is nil")
	}
	err := sie.client.templates.systemIntakeReopenRequest.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendReopenRequestNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendReopenRequestNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	reason models.HTML,
	submittedAt *time.Time,
	additionalInfo *models.HTML,
) error {

	if requestName == "" {
		requestName = "Draft System Intake"
	}
	subject := fmt.Sprintf("The Governance Team has re-opened %s in EASi", requestName)
	body, err := sie.reopenRequestBody(systemIntakeID, requestName, requesterName, reason, submittedAt, additionalInfo)
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
