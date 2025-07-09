package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SendGRBReviewVoteSubmittedInput struct {
	Recipient          models.EmailAddress
	SystemIntakeID     uuid.UUID
	ProjectTitle       string
	RequesterName      string
	RequesterComponent string
	StartDate          time.Time
	EndDate            time.Time
	Vote               models.SystemIntakeAsyncGRBVotingOption
}

type grbReviewVoteSubmittedBody struct {
	ProjectTitle       string
	Link               string
	RequesterName      string
	RequesterComponent string
	DateInfo           string
	Vote               string
}

func (sie systemIntakeEmails) grbReviewVoteSubmittedBody(input SendGRBReviewVoteSubmittedInput) (string, error) {
	if sie.client.templates.grbReviewVoteSubmitted == nil {
		return "", errors.New("grb review vote submitted template is nil")
	}

	var voteStr string
	switch input.Vote {
	case models.SystemIntakeAsyncGRBVotingOptionNoObjection:
		voteStr = "No Objection"
	case models.SystemIntakeAsyncGRBVotingOptionObjection:
		voteStr = "Objection"

	default:
		return "", fmt.Errorf("unexpected/missing vote data: %s", input.Vote.String())
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	formattedStart := input.StartDate.Format("01/02/2006")
	formattedEnd := input.EndDate.Format("01/02/2006")

	data := grbReviewVoteSubmittedBody{
		ProjectTitle:       input.ProjectTitle,
		Link:               sie.client.urlFromPath(grbReviewPath),
		RequesterName:      input.RequesterName,
		RequesterComponent: translation.GetComponentAcronym(input.RequesterComponent),
		DateInfo:           fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		Vote:               voteStr,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewVoteSubmitted.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewVoteSubmitted(ctx context.Context, input SendGRBReviewVoteSubmittedInput) error {
	body, err := sie.grbReviewVoteSubmittedBody(input)
	if err != nil {
		return fmt.Errorf("problem creating grb review vote submitted body: %w", err)
	}

	subject := fmt.Sprintf("GRB Confirmation: Thank you for your input (%s)", input.ProjectTitle)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
