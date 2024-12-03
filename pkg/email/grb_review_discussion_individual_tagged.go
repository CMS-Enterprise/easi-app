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

// SendGRBReviewDiscussionIndividualTaggedEmailInput contains the data needed to to send an email informing an individual they
// have been tagged in a GRB discussion
type SendGRBReviewDiscussionIndividualTaggedEmailInput struct {
	SystemIntakeID           uuid.UUID
	UserName                 string
	RequestName              string
	DiscussionBoardType      string
	Role                     string
	DiscussionContent        template.HTML
	ITGovernanceInboxAddress string
	Recipient                models.EmailAddress
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
	DiscussionContent        template.HTML
	DiscussionLink           string
	ITGovernanceInboxAddress string
	IsAdmin                  bool
}

func (sie systemIntakeEmails) grbReviewDiscussionIndividualTaggedBody(input SendGRBReviewDiscussionIndividualTaggedEmailInput) (string, error) {
	if sie.client.templates.grbReviewDiscussionIndividualTagged == nil {
		return "", errors.New("grb review discussion reply template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")
	grbDiscussionPath := path.Join(grbReviewPath, "discussionID=BLAH") // TODO: NJD add actual discussion ID field
	role := input.Role
	if len(role) < 1 {
		role = "Governance Admin Team"
	}

	data := GRBReviewDiscussionIndividualTaggedBody{
		UserName:                 input.UserName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      input.DiscussionBoardType,
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPath(grbDiscussionPath),
		ITGovernanceInboxAddress: input.ITGovernanceInboxAddress,
		IsAdmin:                  len(input.Role) < 1,
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

	mail := NewEmail().
		WithToAddresses([]models.EmailAddress{input.Recipient}).
		WithSubject(subject).
		WithBody(body)

	if len(input.Role) < 1 {
		// this is an admin, CC ITGov box
		mail = mail.WithCCAddresses([]models.EmailAddress{"IT_Governance@cms.hhs.gov"})
	}

	return sie.client.sender.Send(ctx, mail)
}
