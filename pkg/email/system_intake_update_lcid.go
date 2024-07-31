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

type systemIntakeUpdateLCIDEmailParameters struct {
	LifecycleID               string
	LifecycleIssuedAt         string
	LifecycleExpiresAtPrev    string
	LifecycleExpiresAtNew     string
	LifecycleScopePrev        template.HTML
	LifecycleScopeNew         template.HTML
	LifecycleCostBaselinePrev string
	LifecycleCostBaselineNew  string
	DecisionNextStepsPrev     template.HTML
	DecisionNextStepsNew      template.HTML
	ITGovernanceInboxAddress  string
	AmendmentDate             string
	Reason                    template.HTML
	AdditionalInfo            template.HTML
}

func (sie systemIntakeEmails) systemIntakeUpdateLCIDBody(
	lifecycleID string,
	lifecycleIssuedAt *time.Time,
	lifecycleExpiresAtPrev *time.Time,
	lifecycleExpiresAtNew *time.Time,
	lifecycleScopePrev *models.HTML,
	lifecycleScopeNew *models.HTML,
	lifecycleCostBaselinePrev string,
	lifecycleCostBaselineNew string,
	decisionNextStepsPrev *models.HTML,
	decisionNextStepsNew *models.HTML,
	amendmentDate time.Time,
	reason *models.HTML,
	additionalInfo *models.HTML,
) (string, error) {

	var expiresAtPrev string
	if lifecycleExpiresAtPrev != nil {
		expiresAtPrev = lifecycleExpiresAtPrev.Format("01/02/2006")
	}
	var expiresAtNew string
	if lifecycleExpiresAtNew != nil {
		expiresAtNew = lifecycleExpiresAtNew.Format("01/02/2006")
	}
	var issuedAt string
	if lifecycleIssuedAt != nil {
		issuedAt = lifecycleIssuedAt.Format("01/02/2006")
	}

	data := systemIntakeUpdateLCIDEmailParameters{
		LifecycleID:               lifecycleID,
		LifecycleIssuedAt:         issuedAt,
		LifecycleExpiresAtPrev:    expiresAtPrev,
		LifecycleExpiresAtNew:     expiresAtNew,
		LifecycleScopePrev:        lifecycleScopePrev.ToTemplate(),
		LifecycleScopeNew:         lifecycleScopeNew.ToTemplate(),
		LifecycleCostBaselinePrev: lifecycleCostBaselinePrev,
		LifecycleCostBaselineNew:  lifecycleCostBaselineNew,
		DecisionNextStepsPrev:     decisionNextStepsPrev.ToTemplate(),
		DecisionNextStepsNew:      decisionNextStepsNew.ToTemplate(),
		ITGovernanceInboxAddress:  sie.client.config.GRTEmail.String(),
		AmendmentDate:             amendmentDate.Format("01/02/2006"),
		Reason:                    reason.ToTemplate(),
		AdditionalInfo:            additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeUpdateLCID == nil {
		return "", errors.New("update lcid template is nil")
	}
	err := sie.client.templates.systemIntakeUpdateLCID.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendUpdateLCIDNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendUpdateLCIDNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	lifecycleID string,
	lifecycleIssuedAt *time.Time,
	lifecycleExpiresAtPrev *time.Time,
	lifecycleExpiresAtNew *time.Time,
	lifecycleScopePrev *models.HTML,
	lifecycleScopeNew *models.HTML,
	lifecycleCostBaselinePrev string,
	lifecycleCostBaselineNew string,
	decisionNextStepsPrev *models.HTML,
	decisionNextStepsNew *models.HTML,
	amendmentDate time.Time,
	reason *models.HTML,
	additionalInfo *models.HTML,
) error {
	subject := fmt.Sprintf("A Life Cycle ID (%s) has been updated", lifecycleID)
	body, err := sie.systemIntakeUpdateLCIDBody(
		lifecycleID,
		lifecycleIssuedAt,
		lifecycleExpiresAtPrev,
		lifecycleExpiresAtNew,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		reason,
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
