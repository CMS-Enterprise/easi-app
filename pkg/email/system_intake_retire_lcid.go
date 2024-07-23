package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type systemIntakeRetireLCIDEmailParameters struct {
	LifecycleID              string
	LifecycleRetiresAt       string
	LifecycleExpiresAt       string
	LifecycleIssuedAt        string
	LifecycleScope           template.HTML
	LifecycleCostBaseline    string
	Reason                   template.HTML
	DecisionNextSteps        template.HTML
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) systemIntakeRetireLCIDBody(
	lifecycleID string,
	lifecycleRetiresAt *time.Time,
	lifecycleExpiresAt *time.Time,
	lifecycleIssuedAt *time.Time,
	lifecycleScope *models.HTML,
	lifecycleCostBaseline string,
	reason *models.HTML,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	var retiresAt string
	if lifecycleRetiresAt != nil {
		retiresAt = lifecycleRetiresAt.Format("01/02/2006")
	}
	var expiresAt string
	if lifecycleExpiresAt != nil {
		expiresAt = lifecycleExpiresAt.Format("01/02/2006")
	}
	var issuedAt string
	if lifecycleIssuedAt != nil {
		issuedAt = lifecycleIssuedAt.Format("01/02/2006")
	}
	data := systemIntakeRetireLCIDEmailParameters{
		LifecycleID:              lifecycleID,
		LifecycleRetiresAt:       retiresAt,
		LifecycleExpiresAt:       expiresAt,
		LifecycleIssuedAt:        issuedAt,
		LifecycleScope:           lifecycleScope.ToTemplate(),
		LifecycleCostBaseline:    lifecycleCostBaseline,
		Reason:                   reason.ToTemplate(),
		DecisionNextSteps:        decisionNextSteps.ToTemplate(),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeRetireLCID == nil {
		return "", errors.New("retire lcid template is nil")
	}
	err := sie.client.templates.systemIntakeRetireLCID.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendRetireLCIDNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendRetireLCIDNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lifecycleID string,
	lifecycleRetiresAt *time.Time,
	lifecycleExpiresAt *time.Time,
	lifecycleIssuedAt *time.Time,
	lifecycleScope *models.HTML,
	lifecycleCostBaseline string,
	reason *models.HTML,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) error {

	subject := fmt.Sprintf("A Life Cycle ID (%s) has been retired", lifecycleID)
	body, err := sie.systemIntakeRetireLCIDBody(
		lifecycleID,
		lifecycleRetiresAt,
		lifecycleExpiresAt,
		lifecycleIssuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		reason,
		decisionNextSteps,
		additionalInfo,
	)
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
