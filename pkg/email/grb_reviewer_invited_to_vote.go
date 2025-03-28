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

const dateFormat = "01/02/2006"

type SendGRBReviewerInvitedToVoteInput struct {
	Recipient          models.EmailAddress
	StartDate          time.Time
	EndDate            time.Time
	SystemIntakeID     uuid.UUID
	ProjectName        string
	RequesterName      string
	RequesterComponent string
}

type grbReviewerInvitedToVoteBody struct {
	EndDate                  time.Time
	SystemIntakeLink         string
	ProjectName              string
	RequesterName            string
	RequesterComponent       string
	DateInfo                 string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) grbReviewerInvitedToVoteBody(input SendGRBReviewerInvitedToVoteInput) (string, error) {
	if sie.client.templates.grbReviewerInvitedToVote == nil {
		return "", errors.New("grb reviewer invited to vote template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	formattedStart := input.StartDate.Format(dateFormat)
	formattedEnd := input.EndDate.Format(dateFormat)

	data := grbReviewerInvitedToVoteBody{
		EndDate:                  input.EndDate,
		SystemIntakeLink:         grbReviewPath,
		ProjectName:              input.ProjectName,
		RequesterName:            input.RequesterName,
		RequesterComponent:       input.RequesterComponent,
		DateInfo:                 fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewerInvitedToVote.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewerInvitedToVoteEmail(ctx context.Context, input SendGRBReviewerInvitedToVoteInput) error {
	body, err := sie.grbReviewerInvitedToVoteBody(input)
	if err != nil {
		return err
	}

	subject := fmt.Sprintf("GRB review requested: Your input is needed for an IT Governance request (%s)", input.ProjectName)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
