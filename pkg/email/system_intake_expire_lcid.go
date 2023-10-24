package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type systemIntakeExpireLCIDEmailParameters struct {
	LifecycleID              string
	LifecycleExpiresAt       string
	LifecycleScope           template.HTML
	LifecycleCostBaseline    string
	Reason                   template.HTML
	DecisionNextSteps        template.HTML
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) SystemIntakeExpireLCIDBody(
	lifecycleID string,
	lifecycleExpiresAt *time.Time,
	lifecycleScope models.HTML,
	lifecycleCostBaseline string,
	reason models.HTML,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	var expiresAt string
	if lifecycleExpiresAt != nil {
		expiresAt = lifecycleExpiresAt.Format("01/02/2006")
	}
	data := systemIntakeExpireLCIDEmailParameters{
		LifecycleID:              lifecycleID,
		LifecycleExpiresAt:       expiresAt,
		LifecycleScope:           lifecycleScope.ToTemplate(),
		LifecycleCostBaseline:    lifecycleCostBaseline,
		Reason:                   reason.ToTemplate(),
		DecisionNextSteps:        decisionNextSteps.ToTemplate(),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeExpireLCID == nil {
		return "", errors.New("expire lcid template is nil")
	}
	err := sie.client.templates.systemIntakeExpireLCID.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// TODO: add date LCID was issued (EASI-3319)
// SendExpireLCIDNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendExpireLCIDNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lifecycleID string,
	lifecycleExpiresAt *time.Time,
	lifecycleScope models.HTML,
	lifecycleCostBaseline string,
	reason models.HTML,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) error {

	subject := fmt.Sprintf("A Life Cycle ID (%s) has expired", lifecycleID)
	body, err := sie.SystemIntakeExpireLCIDBody(
		lifecycleID,
		lifecycleExpiresAt,
		lifecycleScope,
		lifecycleCostBaseline,
		reason,
		decisionNextSteps,
		additionalInfo,
	)
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
