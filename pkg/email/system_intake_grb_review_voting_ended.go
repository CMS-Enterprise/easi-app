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

type SendSystemIntakeGRBReviewEndedInput struct {
	Recipient          models.EmailAddress
	SystemIntakeID     uuid.UUID
	ProjectName        string
	RequesterName      string
	RequesterComponent string
	GRBReviewStart     time.Time
	GRBReviewDeadline  time.Time
}

type systemIntakeGRBReviewEndedBody struct {
	ProjectName              string
	RequesterName            string
	RequesterComponent       string
	GRBReviewStart           string
	GRBReviewDeadline        string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) systemIntakeGRBReviewEndedBody(input SendSystemIntakeGRBReviewEndedInput) (string, error) {
	if sie.client.templates.grbReviewEnded == nil {
		return "", errors.New("GRB review ended template is nil")
	}

	data := systemIntakeGRBReviewEndedBody{
		ProjectName:              input.ProjectName,
		RequesterName:            input.RequesterName,
		RequesterComponent:       translation.GetComponentAcronym(input.RequesterComponent),
		GRBReviewStart:           input.GRBReviewStart.Format("01/02/2006"),
		GRBReviewDeadline:        input.GRBReviewDeadline.Format("01/02/2006"),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewEnded.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendSystemIntakeGRBReviewEnded(ctx context.Context, input SendSystemIntakeGRBReviewEndedInput) error {
	body, err := sie.systemIntakeGRBReviewEndedBody(input)
	if err != nil {
		return fmt.Errorf("problem sending GRB review ended email: %w", err)
	}

	subject := fmt.Sprintf("A GRB review is now closed (%s)", input.ProjectName)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
