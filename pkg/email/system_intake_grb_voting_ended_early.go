package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SendSystemIntakeGRBReviewEndedEarlyInput struct {
	Recipient          models.EmailAddress
	SystemIntakeID     uuid.UUID
	ProjectTitle       string
	RequesterName      string
	RequesterComponent string
	StartDate          time.Time
	EndDate            time.Time
}

type systemIntakeGRBReviewEndedEarlyBody struct {
	ProjectTitle             string
	RequesterName            string
	RequesterComponent       string
	DateInfo                 string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) systemIntakeGRBReviewEndedEarlyBody(input SendSystemIntakeGRBReviewEndedEarlyInput) (string, error) {
	if sie.client.templates.grbReviewEndedEarly == nil {
		return "", errors.New("grb review ended early template is nil")
	}

	formattedStart := input.StartDate.Format("01/02/2006")
	formattedEnd := input.EndDate.Format("01/02/2006")

	data := systemIntakeGRBReviewEndedEarlyBody{
		ProjectTitle:             input.ProjectTitle,
		RequesterName:            input.RequesterName,
		RequesterComponent:       translation.GetComponentAcronym(input.RequesterComponent),
		DateInfo:                 fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewEndedEarly.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendSystemIntakeGRBReviewEndedEarly(ctx context.Context, input SendSystemIntakeGRBReviewEndedEarlyInput) error {
	body, err := sie.systemIntakeGRBReviewEndedEarlyBody(input)
	if err != nil {
		return fmt.Errorf("problem creating system intake grb review ended early body: %w", err)
	}

	subject := fmt.Sprintf("The Governance Admin Team has closed a GRB review (%s)", input.ProjectTitle)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)

}
