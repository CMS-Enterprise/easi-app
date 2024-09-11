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

type lcidExperationAlert struct {
	ProjectName   string
	RequesterName string
	LifecycleID   string
	LCIDIssuedAt  string
	ExpiresAt     string
	Scope         template.HTML
	CostBaseline  string
	NextSteps     template.HTML
	GRTEmail      string
	RequesterLink string
	GRTLink       string
}

func (c Client) lcidExpirationBody(
	ctx context.Context,
	systemIntakeID uuid.UUID,
	projectName string,
	requesterName string,
	lcid string,
	lcidIssuedAt *time.Time,
	lcidExpirationDate *time.Time,
	scope models.HTML,
	lifecycleCostBaseline string,
	nextSteps models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	grtPath := path.Join("it-governance", systemIntakeID.String(), "lcid")
	var issuedAt string
	if lcidIssuedAt != nil {
		issuedAt = lcidIssuedAt.Format("01/02/2006")
	}
	var expiresAt string
	if lcidExpirationDate != nil {
		expiresAt = lcidExpirationDate.Format("01/02/2006")
	}
	data := lcidExperationAlert{
		ProjectName:   projectName,
		RequesterName: requesterName,
		LifecycleID:   lcid,
		LCIDIssuedAt:  issuedAt,
		ExpiresAt:     expiresAt,
		Scope:         scope.ToTemplate(),
		CostBaseline:  lifecycleCostBaseline,
		NextSteps:     nextSteps.ToTemplate(),
		GRTEmail:      string(c.config.GRTEmail),
		RequesterLink: c.urlFromPath(requesterPath),
		GRTLink:       c.urlFromPath(grtPath),
	}

	var b bytes.Buffer
	if c.templates.lcidExpirationAlertTemplate == nil {
		return "", errors.New("LCID expiration alert template is nil")
	}

	err := c.templates.lcidExpirationAlertTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendLCIDExpirationAlertEmail sends an email to the governance mailbox notifying them about LCID that is expiring soon
func (c Client) SendLCIDExpirationAlertEmail(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectName string,
	requesterName string,
	lcid string,
	lcidIssuedAt *time.Time,
	lcidExpirationDate *time.Time,
	scope models.HTML,
	lifecycleCostBaseline string,
	nextSteps models.HTML,
) error {
	subject := fmt.Sprintf("Warning: Your Life Cycle ID (%s) for %s is about to expire", lcid, projectName)
	body, err := c.lcidExpirationBody(
		ctx,
		systemIntakeID,
		projectName,
		requesterName,
		lcid,
		lcidIssuedAt,
		lcidExpirationDate,
		scope,
		lifecycleCostBaseline,
		nextSteps,
	)

	if err != nil {
		return err
	}

	// TODO: No CC b/c we set the ShouldNotifyITGovernance bool as true in recipients.
	//       This however doesn't cc the governance mailbox but sends directly to it, we should maybe allow for specification between cc'ing and sending directly?
	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(c.listAllRecipients(recipients)).
			WithSubject(subject).
			WithBody(body),
	)
}
