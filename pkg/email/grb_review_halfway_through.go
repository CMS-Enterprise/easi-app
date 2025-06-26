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

type SendGRBReviewHalfwayThroughInput struct {
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

type grbReviewHalfwayThroughBody struct {
	ProjectTitle       string
	Link               string
	TimeRemaining      string
	RequesterName      string
	RequesterComponent string
	DateInfo           string
	VoteInfo           string
}

func (sie systemIntakeEmails) grbReviewHalfwayThroughBody(input SendGRBReviewHalfwayThroughInput) (string, error) {
	if sie.client.templates.grbReviewHalfwayThrough == nil {
		return "", errors.New("grb halfway through template is nil")
	}
	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	formattedStart := input.StartDate.Format("01/02/2006")
	formattedEnd := input.EndDate.Format("01/02/2006")

	data := grbReviewHalfwayThroughBody{
		ProjectTitle:       input.ProjectTitle,
		Link:               sie.client.urlFromPath(grbReviewPath),
		TimeRemaining:      buildRemainingTime(input.EndDate),
		RequesterName:      input.RequesterName,
		RequesterComponent: translation.GetComponentAcronym(input.RequesterComponent),
		DateInfo:           fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd),
		VoteInfo:           fmt.Sprintf("%[1]d objection, %[2]d no objection, %[3]d no vote", input.ObjectionVotes, input.NoObjectionVotes, input.NotYetVoted),
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewHalfwayThrough.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewHalfwayThrough(ctx context.Context, input SendGRBReviewHalfwayThroughInput) error {
	body, err := sie.grbReviewHalfwayThroughBody(input)
	if err != nil {
		return fmt.Errorf("problem creating grb review halfway through body: %w", err)
	}

	subject := fmt.Sprintf("The GRB review for %s is halfway complete", input.ProjectTitle)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}

func buildRemainingTime(endDate time.Time) string {
	remainingTime := time.Until(endDate)
	daysLeft := int(remainingTime.Hours()) / 24
	hoursLeft := int(remainingTime.Hours()) % 24
	minutesLeft := int(remainingTime.Minutes()) % 60

	var (
		daysStr    string
		hoursStr   string
		minutesStr string
	)

	if daysLeft == 1 {
		daysStr = "1 day"
	} else {
		daysStr = fmt.Sprintf("%d days", daysLeft)
	}

	if hoursLeft == 1 {
		hoursStr = "1 hour"
	} else {
		hoursStr = fmt.Sprintf("%d hours", hoursLeft)
	}

	if minutesLeft == 1 {
		minutesStr = "1 minute"
	} else {
		minutesStr = fmt.Sprintf("%d minutes", minutesLeft)
	}

	return fmt.Sprintf("%[1]s, %[2]s, %[3]s", daysStr, hoursStr, minutesStr)
}
