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

// SendGRBReviewDiscussionGroupTaggedEmailInput contains the data needed to send an email informing a group they
// have been tagged in a GRB discussion
type SendGRBReviewDiscussionGroupTaggedEmailInput struct {
	SystemIntakeID           uuid.UUID
	UserName                 string
	GroupName                string // TODO NJD enum?
	RequestName              string
	Role                     string
	DiscussionContent        template.HTML
	DiscussionID             uuid.UUID
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
	IsAdmin                  bool
}

func (sie systemIntakeEmails) grbReviewDiscussionGroupTaggedBody(input SendGRBReviewDiscussionGroupTaggedEmailInput) (string, error) {
	if sie.client.templates.grbReviewDiscussionGroupTagged == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	role := input.Role
	if len(role) < 1 {
		role = "Governance Admin Team"
	}

	data := GRBReviewDiscussionGroupTaggedBody{
		UserName:                 input.UserName,
		GroupName:                input.GroupName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      "Internal GRB Discussion Board",
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           fmt.Sprintf("%[1]s?discussionMode=reply&discussionId=%[2]s", sie.client.urlFromPath(grbReviewPath), input.DiscussionID.String()),
		ITGovernanceInboxAddress: input.ITGovernanceInboxAddress,
		IsAdmin:                  len(input.Role) < 1,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewDiscussionGroupTagged.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendGRBReviewDiscussionGroupTaggedEmail sends an email to a group indicating that they have
// been tagged in a GRB discussion
func (sie systemIntakeEmails) SendGRBReviewDiscussionGroupTaggedEmail(ctx context.Context, input SendGRBReviewDiscussionGroupTaggedEmailInput) error {
	subject := fmt.Sprintf("The %[1]s was tagged in a GRB Review discussion for %[2]s", input.GroupName, input.RequestName)

	body, err := sie.grbReviewDiscussionGroupTaggedBody(input)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			// use BCC as this is going to multiple recipients
			WithBCCAddresses(input.Recipients).
			WithSubject(subject).
			WithBody(body),
	)
}
