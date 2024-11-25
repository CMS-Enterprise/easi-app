package email

import (
	"bytes"
	"context"
	"errors"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendGRBReviewDiscussionIndividualTaggedEmailInput contains the data needed to to send an email informing an individual they
// have been tagged in a GRB discussion
type SendGRBReviewDiscussionIndividualTaggedEmailInput struct {
	SystemIntakeID           uuid.UUID
	UserName                 string
	RequestName              string
	DiscussionBoardType      string
	GRBReviewLink            string
	Role                     string
	DiscussionContent        string // TODO: NJD *models.HTML?
	DiscussionLink           string
	ITGovernanceInboxAddress string
	Recipients               []models.EmailAddress
}

// GRBReviewDiscussionIndividualTaggedBody contains the data needed for interpolation in
// the GRB Discussion Individual Tagged email template
type GRBReviewDiscussionIndividualTaggedBody struct {
	SystemIntakeID           uuid.UUID
	UserName                 string
	RequestName              string
	DiscussionBoardType      string
	GRBReviewLink            string
	Role                     string
	DiscussionContent        string // TODO: NJD *models.HTML?
	DiscussionLink           string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) grbReviewDiscussionIndividualTaggedBody(input SendGRBReviewDiscussionIndividualTaggedEmailInput) (string, error) {
	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")
	grbDiscussionPath := path.Join(grbReviewPath, "discussionID=BLAH") // TODO: NJD add actual discussion ID field

	data := GRBReviewDiscussionIndividualTaggedBody{
		UserName:                 input.UserName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      input.DiscussionBoardType,
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     input.Role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPath(grbDiscussionPath),
		ITGovernanceInboxAddress: input.ITGovernanceInboxAddress,
	}

	if sie.client.templates.grbReviewDiscussionIndividualTagged == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewDiscussionIndividualTagged.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendGRBReviewDiscussionIndividualTaggedEmail sends an email to an individual indicating that they have
// been tagged in a GRB discussion
func (sie systemIntakeEmails) SendGRBReviewDiscussionIndividualTaggedEmail(ctx context.Context, input SendGRBReviewDiscussionIndividualTaggedEmailInput) error {
	subject := "You were tagged in a GRB Review discussion for " + input.RequestName

	body, err := sie.grbReviewDiscussionIndividualTaggedBody(input)
	if err != nil {
		return err
	}

	allRecipients := input.Recipients

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(allRecipients). // TODO: NJD cc and/or bcc?
			WithSubject(subject).
			WithBody(body),
	)
}
