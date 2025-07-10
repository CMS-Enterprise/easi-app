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

type SendGRBReviewVoteSubmittedAdminInput struct {
	SystemIntakeID     uuid.UUID
	GRBMemberName      string
	ProjectTitle       string
	RequesterName      string
	RequesterComponent string
	StartDate          time.Time
	EndDate            time.Time
	Vote               models.SystemIntakeAsyncGRBVotingOption
	AdditionalComments string
	NoObjectionVotes   int
	ObjectionVotes     int
	NotYetVoted        int
}

type grbReviewVoteSubmittedAdminBody struct {
	GRBMemberName      string
	ProjectTitle       string
	Link               string
	RequesterName      string
	RequesterComponent string
	DateInfo           string
	VoteInfo           string
	Vote               string
	AdditionalComments string
}

func (sie systemIntakeEmails) grbReviewVoteSubmittedAdminBody(input SendGRBReviewVoteSubmittedAdminInput) (string, error) {
	if sie.client.templates.grbReviewVoteSubmittedAdmin == nil {
		return "", errors.New("grb review vote submitted admin template is nil")
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

	data := grbReviewVoteSubmittedAdminBody{
		GRBMemberName:      input.GRBMemberName,
		ProjectTitle:       input.ProjectTitle,
		Link:               grbReviewPath,
		RequesterName:      input.RequesterName,
		RequesterComponent: translation.GetComponentAcronym(input.RequesterComponent),
		DateInfo:           fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		VoteInfo:           fmt.Sprintf("%[1]d objection, %[2]d no objection, %[3]d no vote", input.ObjectionVotes, input.NoObjectionVotes, input.NotYetVoted),
		Vote:               voteStr,
		AdditionalComments: input.AdditionalComments,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewVoteSubmittedAdmin.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewVoteSubmittedAdmin(ctx context.Context, input SendGRBReviewVoteSubmittedAdminInput) error {
	body, err := sie.grbReviewVoteSubmittedAdminBody(input)
	if err != nil {
		return fmt.Errorf("problem creating grb review vote submitted admin body: %w", err)
	}

	subject := fmt.Sprintf("GRB vote submitted for %s", input.ProjectTitle)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
