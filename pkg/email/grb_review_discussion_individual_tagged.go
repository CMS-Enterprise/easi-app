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

// SendGRBReviewDiscussionIndividualTaggedEmailInput contains the data needed to to send an email informing an individual they
// have been tagged in a GRB discussion
type SendGRBReviewDiscussionIndividualTaggedEmailInput struct {
	SystemIntakeID    uuid.UUID
	UserName          string
	RequestName       string
	Role              string
	DiscussionID      uuid.UUID
	DiscussionContent template.HTML
	Recipients        []models.EmailAddress
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
	ITGovernanceInboxAddress models.EmailAddress
	IsAdmin                  bool
}

func (sie systemIntakeEmails) grbReviewDiscussionIndividualTaggedBody(input SendGRBReviewDiscussionIndividualTaggedEmailInput) (string, error) {
	if sie.client.templates.grbReviewDiscussionIndividualTagged == nil {
		return "", errors.New("grb review discussion individual tagged template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	data := GRBReviewDiscussionIndividualTaggedBody{
		UserName:                 input.UserName,
		RequestName:              input.RequestName,
		DiscussionBoardType:      "Internal GRB Discussion Board",
		GRBReviewLink:            sie.client.urlFromPath(grbReviewPath),
		Role:                     input.Role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPathAndQuery(grbReviewPath, fmt.Sprintf("discussionMode=reply&discussionId=%s", input.DiscussionID.String())),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
		IsAdmin:                  input.Role == "Governance Admin Team",
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
	subject := fmt.Sprintf("You were tagged in a GRB Review discussion for %s", input.RequestName)

	body, err := sie.grbReviewDiscussionIndividualTaggedBody(input)
	if err != nil {
		return err
	}

	mail := NewEmail().
		WithBCCAddresses(input.Recipients).
		WithSubject(subject).
		WithBody(body)

	return sie.client.sender.Send(ctx, mail)
}
