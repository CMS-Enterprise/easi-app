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

type SendGRBReviewVoteChangedAdminInput struct {
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

type grbReviewVoteChangedBody struct {
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

func (sie systemIntakeEmails) grbReviewVoteChangedBody(input SendGRBReviewVoteChangedAdminInput) (string, error) {
	if sie.client.templates.grbReviewVoteChangedAdmin == nil {
		return "", errors.New("grb review vote changed admin template is nil")
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

	data := grbReviewVoteChangedBody{
		GRBMemberName:      input.GRBMemberName,
		ProjectTitle:       input.ProjectTitle,
		Link:               sie.client.urlFromPath(grbReviewPath),
		RequesterName:      input.RequesterName,
		RequesterComponent: translation.GetComponentAcronym(input.RequesterComponent),
		DateInfo:           fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		VoteInfo:           fmt.Sprintf("%[1]d objection, %[2]d no objection, %[3]d no vote", input.ObjectionVotes, input.NoObjectionVotes, input.NotYetVoted),
		Vote:               voteStr,
		AdditionalComments: input.AdditionalComments,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewVoteChangedAdmin.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewVoteChangedAdmin(ctx context.Context, input SendGRBReviewVoteChangedAdminInput) error {
	body, err := sie.grbReviewVoteChangedBody(input)
	if err != nil {
		return fmt.Errorf("problem creating grb review vote changed admin body: %w", err)
	}

	subject := fmt.Sprintf("A GRB member changed their vote change for %s", input.ProjectTitle)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
