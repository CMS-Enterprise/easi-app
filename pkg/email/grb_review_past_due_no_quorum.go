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

type SendGRBReviewPastDueNoQuorumInput struct {
	SystemIntakeID     uuid.UUID
	ProjectTitle       string
	RequesterName      string
	RequesterComponent string
	StartDate          time.Time
	EndDate            time.Time
	NoObjectionVotes   int
	ObjectionVotes     int
	NotYetVoted        int
}

type grbReviewPastDueNoQuorumBody struct {
	ProjectTitle       string
	Link               string
	RequesterName      string
	RequesterComponent string
	DateInfo           string
	VoteInfo           string
}

func (sie systemIntakeEmails) grbReviewPastDueNoQuorumBody(input SendGRBReviewPastDueNoQuorumInput) (string, error) {
	if sie.client.templates.grbReviewPastDueNoQuorum == nil {
		return "", errors.New("grb past due no quorum template is nil")
	}
	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	formattedStart := input.StartDate.Format("01/02/2006")
	formattedEnd := input.EndDate.Format("01/02/2006")

	data := grbReviewPastDueNoQuorumBody{
		ProjectTitle:       input.ProjectTitle,
		Link:               sie.client.urlFromPath(grbReviewPath),
		RequesterName:      input.RequesterName,
		RequesterComponent: translation.GetComponentAcronym(input.RequesterComponent),
		DateInfo:           fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		VoteInfo:           fmt.Sprintf("%[1]d objection, %[2]d no objection, %[3]d no vote", input.ObjectionVotes, input.NoObjectionVotes, input.NotYetVoted),
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewPastDueNoQuorum.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewPastDueNoQuorum(ctx context.Context, input SendGRBReviewPastDueNoQuorumInput) error {
	body, err := sie.grbReviewPastDueNoQuorumBody(input)
	if err != nil {
		return fmt.Errorf("problem creating grb review past due no quorum body: %w", err)
	}

	subject := fmt.Sprintf("The GRB review for %s is past due", input.ProjectTitle)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
