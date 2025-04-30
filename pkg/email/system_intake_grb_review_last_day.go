package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/google/uuid"
)

type SendSystemIntakeGRBReviewLastDayInput struct {
	Recipient          models.EmailAddress
	SystemIntakeID     uuid.UUID
	ProjectName        string
	RequesterName      string
	RequesterComponent string
	GRBReviewStart     time.Time
	GRBReviewDeadline  time.Time
}

type systemIntakeGRBReviewLastDayBody struct {
	SystemIntakeRequestLink  string
	ProjectName              string
	RequesterName            string
	RequesterComponent       string
	GRBReviewStart           string
	GRBReviewDeadline        string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) systemIntakeGRBReviewLastDayBody(
	input SendSystemIntakeGRBReviewLastDayInput,
) (string, error) {
	if sie.client.templates.grbReviewLastDay == nil {
		return "", errors.New("GRB review last-day template is nil")
	}

	link := sie.client.urlFromPath(
		fmt.Sprintf("governance-task-list/%s", input.SystemIntakeID.String()),
	)

	data := systemIntakeGRBReviewLastDayBody{
		SystemIntakeRequestLink:  link,
		ProjectName:              input.ProjectName,
		RequesterName:            input.RequesterName,
		RequesterComponent:       translation.GetComponentAcronym(input.RequesterComponent),
		GRBReviewStart:           input.GRBReviewStart.Format("01/02/2006"),
		GRBReviewDeadline:        input.GRBReviewDeadline.Format("01/02/2006"),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewLastDay.Execute(&b, data); err != nil {
		return "", err
	}
	return b.String(), nil
}

func (sie systemIntakeEmails) SendSystemIntakeGRBReviewLastDay(
	ctx context.Context,
	input SendSystemIntakeGRBReviewLastDayInput,
) error {
	body, err := sie.systemIntakeGRBReviewLastDayBody(input)
	if err != nil {
		return fmt.Errorf("building GRB last-day email: %w", err)
	}

	subject := fmt.Sprintf("One day left in GRB review (%s)", input.ProjectName)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
