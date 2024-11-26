package email

import (
	"bytes"
	"context"
	"errors"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendGRBReviewDiscussionGroupTaggedEmailInput contains the data needed to to send an email informing an group they
// have been tagged in a GRB discussion
type SendGRBReviewDiscussionGroupTaggedEmailInput struct {
	SystemIntakeID           uuid.UUID
	UserName                 string
	GroupName                string // TODO NJD enum?
	RequestName              string
	DiscussionBoardType      string
	GRBReviewLink            string
	Role                     string
	DiscussionContent        template.HTML
	DiscussionLink           string
	ITGovernanceInboxAddress string
	Recipients               []models.EmailAddress
}

// GRBReviewDiscussionGroupTaggedBody contains the data needed for interpolation in
// the GRB Discussion Group Tagged email template
type GRBReviewDiscussionGroupTaggedBody struct {
	SystemIntakeID           uuid.UUID
	UserName                 string
	GroupName                string
	RequestName              string
	DiscussionBoardType      string
	GRBReviewLink            string
	Role                     string
	DiscussionContent        template.HTML
	DiscussionLink           string
	ClientAddress            string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) grbReviewDiscussionGroupTaggedBody(input SendGRBReviewDiscussionGroupTaggedEmailInput) (string, error) {
	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")
	grbDiscussionPath := path.Join(grbReviewPath, "discussionID=BLAH") // TODO: NJD add actual discussion ID field

	data := GRBReviewDiscussionGroupTaggedBody{
		UserName:                 input.UserName,
		GroupName:                input.GroupName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      input.DiscussionBoardType,
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     input.Role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPath(grbDiscussionPath),
		ITGovernanceInboxAddress: input.ITGovernanceInboxAddress,
	}

	if sie.client.templates.grbReviewDiscussionGroupTagged == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewDiscussionGroupTagged.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendGRBReviewDiscussionGroupTaggedEmail sends an email to an group indicating that they have
// been tagged in a GRB discussion
func (sie systemIntakeEmails) SendGRBReviewDiscussionGroupTaggedEmail(ctx context.Context, input SendGRBReviewDiscussionGroupTaggedEmailInput) error {
	subject := "The " + input.GroupName + "was tagged in a GRB Review discussion for " + input.RequestName

	body, err := sie.grbReviewDiscussionGroupTaggedBody(input)
	if err != nil {
		return err
	}

	// allRecipients := input.Recipients
	allRecipients := []models.EmailAddress{}
	allRecipients = append(allRecipients, models.NewEmailAddress("fake@fake.com"))

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(allRecipients). // TODO: NJD cc and/or bcc?
			WithSubject(subject).
			WithBody(body),
	)
}
