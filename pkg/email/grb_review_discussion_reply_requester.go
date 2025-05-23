package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SendGRBReviewDiscussionReplyRequesterEmailInput struct {
	SystemIntakeID    uuid.UUID
	RequestName       string
	ReplierName       string
	VotingRole        string
	GRBRole           string
	DiscussionContent template.HTML
	Recipient         models.EmailAddress
}

type grbReviewDiscussionReplyRequesterBody struct {
	ReplierName              string
	RequestName              string
	VotingRole               string
	GRBRole                  string
	DiscussionContent        template.HTML
	DiscussionLink           string
	ReplyLink                string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) grbReviewDiscussionReplyRequesterBody(
	input SendGRBReviewDiscussionReplyRequesterEmailInput,
) (string, error) {
	if sie.client.templates.grbReviewDiscussionReplyRequester == nil {
		return "", errors.New("reply‑requester template is nil")
	}

	boardPath := fmt.Sprintf("governance-review-board/%s/discussions", input.SystemIntakeID.String())

	data := grbReviewDiscussionReplyRequesterBody{
		ReplierName:              input.ReplierName,
		RequestName:              input.RequestName,
		VotingRole:               input.VotingRole,
		GRBRole:                  input.GRBRole,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPath(boardPath),
		ReplyLink:                sie.client.urlFromPath(boardPath + "?reply"),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewDiscussionReplyRequester.Execute(&b, data); err != nil {
		return "", err
	}
	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewDiscussionReplyRequesterEmail(
	ctx context.Context,
	input SendGRBReviewDiscussionReplyRequesterEmailInput,
) error {
	body, err := sie.grbReviewDiscussionReplyRequesterBody(input)
	if err != nil {
		return fmt.Errorf("build reply‑requester email: %w", err)
	}

	subject := fmt.Sprintf("New reply to your discussion in the GRB review for %s", input.RequestName)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
