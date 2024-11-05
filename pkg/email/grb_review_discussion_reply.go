package email

import (
	"bytes"
	"context"
	"errors"
	"path"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/google/uuid"
)

// SendGRBReviewDiscussionReplyEmailInput contains the data needed to to send the GRB discussion reply email
type SendGRBReviewDiscussionReplyEmailInput struct {
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

// GRBReviewDiscussionReplyEmailTemplateParams contains the data needed for interpolation in
// the TRB advice letter submitted email template
type GRBReviewDiscussionReplyBody struct {
	UserName                 string
	RequestName              string
	DiscussionBoardType      string
	GRBReviewLink            string
	Role                     string
	DiscussionContent        string // TODO: NJD *models.HTML?
	DiscussionLink           string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) grbReviewDiscussionReplyBody(input SendGRBReviewDiscussionReplyEmailInput) (string, error) {
	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")
	grbDiscussionPath := path.Join(grbReviewPath, "discussionID=BLAH") // TODO: NJD add actual discussion ID field

	data := GRBReviewDiscussionReplyBody{
		UserName:                 input.UserName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      input.DiscussionBoardType,
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     input.Role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPath(grbDiscussionPath),
		ITGovernanceInboxAddress: input.ITGovernanceInboxAddress,
	}

	if sie.client.templates.grbReviewDiscussionReply == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewDiscussionReply.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendGRBReviewDiscussionReplyEmail sends an email to the EASI admin team indicating that an advice letter
// has been submitted
func (sie systemIntakeEmails) SendGRBReviewDiscussionReplyEmail(ctx context.Context, input SendGRBReviewDiscussionReplyEmailInput) error {
	subject := "New reply to your discussion in the GRB Review for " + input.RequestName

	body, err := sie.grbReviewDiscussionReplyBody(input)
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
