package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type lcidExperationAlert struct {
	ProjectName   string
	RequesterName string
	LifecycleID   string
	ExpiresAt     string
	Scope         string
	CostBaseline  string
	NextSteps     string
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
	lcidExpirationDate *time.Time,
	scope string,
	lifecycleCostBaseline string,
	nextSteps string,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	grtPath := path.Join("governance-review-team", systemIntakeID.String(), "lcid")
	data := lcidExperationAlert{
		ProjectName:   projectName,
		RequesterName: requesterName,
		LifecycleID:   lcid,
		ExpiresAt:     lcidExpirationDate.Format("January 2, 2006"),
		Scope:         scope,
		CostBaseline:  lifecycleCostBaseline,
		NextSteps:     nextSteps,
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
	lcidExpirationDate *time.Time,
	scope string,
	lifecycleCostBaseline string,
	nextSteps string,
) error {
	subject := fmt.Sprintf("Warning: Your Lifecycle ID (%s) for %s is about to expire", lcid, projectName)
	body, err := c.lcidExpirationBody(ctx, systemIntakeID, projectName, requesterName, lcid, lcidExpirationDate, scope, lifecycleCostBaseline, nextSteps)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		c.listAllRecipients(recipients),
		nil, // TODO: This is nil b/c we set the ShouldNotifyITGovernance bool as true in recipients.
		//       This however doesn't cc the governance mailbox but sends directly to it, we should maybe allow for specification between cc'ing and sending directly?
		subject,
		body,
	)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
