package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendGRBReviewDiscussionReplyEmailInput contains the data needed to send the GRB discussion reply email
type SendGRBReviewDiscussionReplyEmailInput struct {
	SystemIntakeID    uuid.UUID
	UserName          string
	RequestName       string
	Role              string
	DiscussionID      uuid.UUID
	DiscussionContent template.HTML
	Recipient         models.EmailAddress
}

// GRBReviewDiscussionReplyBody contains the data needed for interpolation in
// the TRB advice letter submitted email template
type GRBReviewDiscussionReplyBody struct {
	UserName                 string
	RequestName              string
	DiscussionBoardType      string
	GRBReviewLink            string
	Role                     string
	DiscussionContent        template.HTML
	DiscussionLink           string
	ITGovernanceInboxAddress models.EmailAddress
	IsAdmin                  bool
}

func (sie systemIntakeEmails) grbReviewDiscussionReplyBody(input SendGRBReviewDiscussionReplyEmailInput) (string, error) {
	if sie.client.templates.grbReviewDiscussionReply == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	role := input.Role

	data := GRBReviewDiscussionReplyBody{
		UserName:                 input.UserName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      "Internal GRB Discussion Board",
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           fmt.Sprintf("%[1]s?discussionMode=reply&discussionId=%[2]s", sie.client.urlFromPath(grbReviewPath), input.DiscussionID.String()),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
		IsAdmin:                  len(input.Role) < 1,
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
	subject := fmt.Sprintf("New reply to your discussion in the GRB Review for %s", input.RequestName)

	body, err := sie.grbReviewDiscussionReplyBody(input)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).
			WithBody(body),
	)
}
