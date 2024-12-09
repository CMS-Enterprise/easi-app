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
	SystemIntakeID    uuid.UUID
	UserName          string
	GroupName         string // TODO NJD enum?
	RequestName       string
	Role              string
	DiscussionContent template.HTML
	DiscussionID      uuid.UUID
	Recipients        models.EmailNotificationRecipients
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
	ITGovernanceInboxAddress models.EmailAddress
	IsAdmin                  bool
}

func (sie systemIntakeEmails) grbReviewDiscussionGroupTaggedBody(input SendGRBReviewDiscussionGroupTaggedEmailInput) (string, error) {
	if sie.client.templates.grbReviewDiscussionGroupTagged == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	data := GRBReviewDiscussionGroupTaggedBody{
		UserName:                 input.UserName,
		GroupName:                input.GroupName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      "Internal GRB Discussion Board",
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     input.Role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPath(fmt.Sprintf("%[1]s?discussionMode=reply&discussionId=%[2]s", grbReviewPath, input.DiscussionID.String())),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
		IsAdmin:                  input.Role == "Governance Admin Team",
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
	email := NewEmail().
		// use BCC as this is going to multiple recipients
		WithBCCAddresses(input.Recipients.RegularRecipientEmails).
		WithSubject(subject).
		WithBody(body)

	if input.Recipients.ShouldNotifyITGovernance {
		email = email.WithCCAddresses([]models.EmailAddress{sie.client.config.GRTEmail})
	}

	return sie.client.sender.Send(
		ctx,
		email,
	)
}
