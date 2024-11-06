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

type systemIntakeChangeLCIDRetirementDateEmailParameters struct {
	LifecycleID              string
	LifecycleRetiresAt       string
	LifecycleExpiresAt       string
	LifecycleIssuedAt        string
	LifecycleScope           template.HTML
	LifecycleCostBaseline    string
	DecisionNextSteps        template.HTML
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) SystemIntakeChangeLCIDRetirementDateBody(
	lifecycleID string,
	lifecycleRetiresAt *time.Time,
	lifecycleExpiresAt *time.Time,
	lifecycleIssuedAt *time.Time,
	lifecycleScope *models.HTML,
	lifecycleCostBaseline string,
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
	data := systemIntakeChangeLCIDRetirementDateEmailParameters{
		LifecycleID:              lifecycleID,
		LifecycleRetiresAt:       retiresAt,
		LifecycleExpiresAt:       expiresAt,
		LifecycleIssuedAt:        issuedAt,
		LifecycleScope:           lifecycleScope.ToTemplate(),
		LifecycleCostBaseline:    lifecycleCostBaseline,
		DecisionNextSteps:        decisionNextSteps.ToTemplate(),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeChangeLCIDRetirementDate == nil {
		return "", errors.New("change lcid retirement date template is nil")
	}
	err := sie.client.templates.systemIntakeChangeLCIDRetirementDate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendChangeLCIDRetirementDateNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendChangeLCIDRetirementDateNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lifecycleID string,
	lifecycleRetiresAt *time.Time,
	lifecycleExpiresAt *time.Time,
	lifecycleIssuedAt *time.Time,
	lifecycleScope *models.HTML,
	lifecycleCostBaseline string,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) error {
	subject := fmt.Sprintf("The retirement date for a Life Cycle ID (%s) has been changed", lifecycleID)
	body, err := sie.SystemIntakeChangeLCIDRetirementDateBody(
		lifecycleID,
		lifecycleRetiresAt,
		lifecycleExpiresAt,
		lifecycleIssuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
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
