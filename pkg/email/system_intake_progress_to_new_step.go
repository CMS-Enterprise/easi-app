package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type systemIntakeProgressToNewStepEmailParameters struct {
	RequestName              string
	Step                     string
	RequesterName            string
	Feedback                 template.HTML
	SystemIntakeRequestLink  string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
	AdditionalInfo           template.HTML
}

func (sie systemIntakeEmails) systemIntakeProgressToNewStepBody(
	systemIntakeID uuid.UUID,
	requestName string,
	step models.SystemIntakeStep,
	requesterName string,
	feedback *models.HTML,
	additionalInfo *models.HTML,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	adminPath := path.Join("it-governance", systemIntakeID.String(), "intake-request")

	data := systemIntakeProgressToNewStepEmailParameters{
		RequestName:              requestName,
		Step:                     HumanizeSnakeCase(string(step)),
		RequesterName:            requesterName,
		Feedback:                 feedback.ToTemplate(),
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		AdditionalInfo:           additionalInfo.ToTemplate(),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeProgressToNewStep == nil {
		return "", errors.New("progress to new step email template is nil")
	}
	err := sie.client.templates.systemIntakeProgressToNewStep.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendProgressToNewStepNotification notifies user-selected recipients that a system intake form has been progressed to a new step
func (sie systemIntakeEmails) SendProgressToNewStepNotification(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	newStep models.SystemIntakeStepToProgressTo,
	requestName string,
	requesterName string,
	feedback *models.HTML,
	additionalInfo *models.HTML,
) error {

	if requestName == "" {
		requestName = "Draft System Intake"
	}
	step := models.SystemIntakeStep(newStep)
	subject := fmt.Sprintf("%s is ready for a %s", requestName, HumanizeSnakeCase(string(step)))
	body, err := sie.systemIntakeProgressToNewStepBody(systemIntakeID, requestName, step, requesterName, feedback, additionalInfo)
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
