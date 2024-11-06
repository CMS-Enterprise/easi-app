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

type systemIntakeUnretireLCIDEmailParameters struct {
	LifecycleID              string
	LifecycleExpiresAt       string
	LifecycleIssuedAt        string
	LifecycleScope           template.HTML
	LifecycleCostBaseline    string
	DecisionNextSteps        template.HTML
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) systemIntakeUnretireLCIDBody(
	lifecycleID string,
	lifecycleExpiresAt *time.Time,
	lifecycleIssuedAt *time.Time,
	lifecycleScope *models.HTML,
	lifecycleCostBaseline string,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	var expiresAt string
	if lifecycleExpiresAt != nil {
		expiresAt = lifecycleExpiresAt.Format("01/02/2006")
	}
	var issuedAt string
	if lifecycleIssuedAt != nil {
		issuedAt = lifecycleIssuedAt.Format("01/02/2006")
	}
	data := systemIntakeUnretireLCIDEmailParameters{
		LifecycleID:              lifecycleID,
		LifecycleExpiresAt:       expiresAt,
		LifecycleIssuedAt:        issuedAt,
		LifecycleScope:           lifecycleScope.ToTemplate(),
		LifecycleCostBaseline:    lifecycleCostBaseline,
		DecisionNextSteps:        decisionNextSteps.ToTemplate(),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeUnretireLCID == nil {
		return "", errors.New("retire lcid template is nil")
	}
	err := sie.client.templates.systemIntakeUnretireLCID.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendUnretireLCIDNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendUnretireLCIDNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lifecycleID string,
	lifecycleExpiresAt *time.Time,
	lifecycleIssuedAt *time.Time,
	lifecycleScope *models.HTML,
	lifecycleCostBaseline string,
	decisionNextSteps *models.HTML,
	additionalInfo *models.HTML,
) error {

	subject := fmt.Sprintf("The reitrement date for a Life Cycle ID (%s) has been removed", lifecycleID)
	body, err := sie.systemIntakeUnretireLCIDBody(
		lifecycleID,
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
