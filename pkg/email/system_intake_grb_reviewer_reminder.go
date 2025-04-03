package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SendSystemIntakeGRBReviewerReminderInput struct {
	Recipient          models.EmailAddress
	SystemIntakeID     uuid.UUID
	RequestName        string
	RequesterName      string
	RequesterComponent string
	StartDate          time.Time
	EndDate            time.Time
}

type systemIntakeGRBReviewerReminderBody struct {
	Link                     string
	RequestName              string
	RequesterName            string
	RequesterComponent       string
	DateInfo                 string
	EndDate                  string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) systemIntakeGRBReviewerReminderBody(input SendSystemIntakeGRBReviewerReminderInput) (string, error) {
	const dateFormat = "01/02/2006"

	if sie.client.templates.grbReviewReminder == nil {
		return "", errors.New("grb review reminder template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	formattedStart := input.StartDate.Format(dateFormat)
	formattedEnd := input.EndDate.Format(dateFormat)

	data := systemIntakeGRBReviewerReminderBody{
		Link:                     sie.client.urlFromPath(grbReviewPath),
		RequestName:              input.RequestName,
		RequesterName:            input.RequesterName,
		RequesterComponent:       input.RequesterComponent,
		DateInfo:                 fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		EndDate:                  formattedEnd,
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewReminder.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendSystemIntakeGRBReviewerReminder(ctx context.Context, input SendSystemIntakeGRBReviewerReminderInput) error {
	body, err := sie.systemIntakeGRBReviewerReminderBody(input)
	if err != nil {
		return fmt.Errorf("problem sending grb reviewer remidner email: %w", err)
	}

	subject := fmt.Sprintf("GRB reminder: review and share your input (%s)", input.RequestName)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
