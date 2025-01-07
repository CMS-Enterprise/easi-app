package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SendGRBReviewPresentationLinksUpdatedEmailInput struct {
	SystemIntakeID     uuid.UUID
	ProjectName        string
	RequesterName      string
	RequesterComponent string
	Recipients         []models.EmailAddress
}

type grbReviewPresentationLinksUpdatedBody struct {
	ProjectName              string
	RequesterName            string
	RequesterComponent       string
	SystemIntakeLink         string
	ITGovernanceInboxAddress models.EmailAddress
}

func (sie systemIntakeEmails) grbReviewPresentationLinksUpdatedBody(input SendGRBReviewPresentationLinksUpdatedEmailInput) (string, error) {
	if sie.client.templates.grbReviewPresentationLinksUpdated == nil {
		return "", errors.New("grb review presentation links updated template is nil")
	}

	grbReviewPath := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	data := grbReviewPresentationLinksUpdatedBody{
		ProjectName:              input.ProjectName,
		SystemIntakeLink:         sie.client.urlFromPath(grbReviewPath),
		RequesterName:            input.RequesterName,
		RequesterComponent:       translation.GetComponentAcronym(input.RequesterComponent),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail,
	}

	var b bytes.Buffer
	if err := sie.client.templates.grbReviewPresentationLinksUpdated.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendGRBReviewPresentationLinksUpdatedEmail(ctx context.Context, input SendGRBReviewPresentationLinksUpdatedEmailInput) error {
	subject := fmt.Sprintf("Presentation links updated on the GRB review for %s", input.ProjectName)

	body, err := sie.grbReviewPresentationLinksUpdatedBody(input)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(input.Recipients).
			WithCCAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
