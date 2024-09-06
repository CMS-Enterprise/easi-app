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

type systemIntakeIssueLCIDEmailParameters struct {
	RequestName              string
	LifecycleID              string
	LifecycleIssuedAt        string
	LifecycleExpiresAt       string
	LifecycleScope           template.HTML
	LifecycleCostBaseline    *string
	DecisionNextSteps        template.HTML
	TRBRecommendation        string
	RequesterName            string
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) SystemIntakeIssueLCIDBody(
	systemIntakeID uuid.UUID,
	requestName string,
	lifecycleID string,
	lifecycleIssuedAt time.Time,
	lifecycleExpiresAt *time.Time,
	lifecycleScope models.HTML,
	lifecycleCostBaseline *string,
	decisionNextSteps models.HTML,
	trbFollowUp models.SystemIntakeTRBFollowUp,
	requesterName string,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("it-governance", systemIntakeID.String(), "intake-request")

	var expiresAt string
	if lifecycleExpiresAt != nil {
		expiresAt = lifecycleExpiresAt.Format("01/02/2006")
	}

	var trbFollowUpReadable string
	switch trbFollowUp {
	case models.TRBFRStronglyRecommended:
		trbFollowUpReadable = "strongly recommends a TRB consult session"
	case models.TRBFRRecommendedButNotCritical:
		trbFollowUpReadable = "recommends a TRB consult session"
	case models.TRBFRNotRecommended:
		trbFollowUpReadable = "does not think a TRB consult is necessary"
	default:
		trbFollowUpReadable = ""
	}

	data := systemIntakeIssueLCIDEmailParameters{
		RequestName:              requestName,
		LifecycleID:              lifecycleID,
		LifecycleIssuedAt:        lifecycleIssuedAt.Format("01/02/2006"),
		LifecycleExpiresAt:       expiresAt,
		LifecycleScope:           lifecycleScope.ToTemplate(),
		LifecycleCostBaseline:    lifecycleCostBaseline,
		DecisionNextSteps:        decisionNextSteps.ToTemplate(),
		TRBRecommendation:        trbFollowUpReadable,
		RequesterName:            requesterName,
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeIssueLCID == nil {
		return "", errors.New("confirm lcid template is nil")
	}
	err := sie.client.templates.systemIntakeIssueLCID.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendIssueLCIDNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendIssueLCIDNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	requestName string,
	lifecycleID string,
	lifecycleIssuedAt time.Time,
	lifecycleExpiresAt *time.Time,
	lifecycleScope models.HTML,
	lifecycleCostBaseline *string,
	decisionNextSteps models.HTML,
	trbFollowUp models.SystemIntakeTRBFollowUp,
	requesterName string,
	additionalInfo *models.HTML,
) error {
	if requestName == "" {
		requestName = "Draft System Intake"
	}
	subject := fmt.Sprintf("A Life Cycle ID (%s) has been issued for %s", lifecycleID, requestName)
	body, err := sie.SystemIntakeIssueLCIDBody(
		systemIntakeID,
		requestName,
		lifecycleID,
		lifecycleIssuedAt,
		lifecycleExpiresAt,
		lifecycleScope,
		lifecycleCostBaseline,
		decisionNextSteps,
		trbFollowUp,
		requesterName,
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
