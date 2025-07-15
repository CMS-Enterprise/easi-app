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

type SendGRBReviewDiscussionProjectTeamIndividualTaggedInput struct {
	SystemIntakeID    uuid.UUID
	UserName          string
	RequestName       string
	Role              string
	DiscussionID      uuid.UUID
	DiscussionContent template.HTML
	DiscussionBoard   models.SystemIntakeGRBDiscussionBoardType
	Recipient         models.EmailAddress
}
type grbReviewDiscussionProjectTeamIndividualTaggedBody struct {
	RequestName              string
	GRBReviewLink            string
	UserName                 string
	Role                     string
	DiscussionContent        template.HTML
	DiscussionLink           string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) grbReviewDiscussionProjectTeamIndividualTaggedBody(input SendGRBReviewDiscussionProjectTeamIndividualTaggedInput) (string, error) {
	if sie.client.templates.grbReviewDiscussionProjectTeamIndividualTagged == nil {
		return "", errors.New("grb review discussion project team individual tagged template is nil")
	}

	intakePath := path.Join("governance-task-list", input.SystemIntakeID.String())

	data := grbReviewDiscussionProjectTeamIndividualTaggedBody{
		RequestName:              input.RequestName,
		GRBReviewLink:            sie.client.urlFromPath(intakePath),
		UserName:                 input.UserName,
		Role:                     input.Role,
		DiscussionContent:        input.DiscussionContent,
		DiscussionLink:           sie.client.urlFromPathAndQuery(intakePath, fmt.Sprintf("discussionBoardType=%[1]s&discussionMode=reply&discussionId=%[2]s", input.DiscussionBoard.String(), input.DiscussionID.String())),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewDiscussionProjectTeamIndividualTagged.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewDiscussionProjectTeamIndividualTaggedEmail(ctx context.Context, input SendGRBReviewDiscussionProjectTeamIndividualTaggedInput) error {
	body, err := sie.grbReviewDiscussionProjectTeamIndividualTaggedBody(input)
	if err != nil {
		return err
	}

	subject := fmt.Sprintf("You were tagged in a GRB Review discussion for %s", input.RequestName)

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.Recipient}).
			WithSubject(subject).WithBody(body),
	)
}
