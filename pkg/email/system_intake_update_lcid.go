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

type systemIntakeUpdateLCIDEmailParameters struct {
	LifecycleID               string
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

func (sie systemIntakeEmails) SystemIntakeUpdateLCIDBody(
	lifecycleID string,
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

	data := systemIntakeUpdateLCIDEmailParameters{
		LifecycleID:               lifecycleID,
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
	body, err := sie.SystemIntakeUpdateLCIDBody(
		lifecycleID,
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
