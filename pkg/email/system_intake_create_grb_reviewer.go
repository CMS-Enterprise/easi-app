package email

import (
	"bytes"
	"context"
	"errors"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type systemIntakeCreateGRBReviewerParameters struct {
	ProjectTitle             string
	RequesterName            string
	RequesterComponent       string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) createGRBReviewerBody(
	systemIntakeID uuid.UUID,
	projectTitle string,
	requesterName string,
	requesterComponent string,
) (string, error) {
	if sie.client.templates.systemIntakeCreateGRBReviewer == nil {
		return "", errors.New("create grb reviewer email template is nil")
	}

	adminPath := path.Join("it-governance", systemIntakeID.String(), "grb-review")

	data := systemIntakeCreateGRBReviewerParameters{
		ProjectTitle:             projectTitle,
		RequesterName:            requesterName,
		RequesterComponent:       translation.GetComponentAcronym(requesterComponent),
		SystemIntakeAdminLink:    sie.client.urlFromPath(adminPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
	}

	var b bytes.Buffer
	if err := sie.client.templates.systemIntakeCreateGRBReviewer.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendCreateGRBReviewerNotification notifies user-selected recipients that a system intake form needs edits
func (sie systemIntakeEmails) SendCreateGRBReviewerNotification(
	ctx context.Context,
	recipients []models.EmailAddress,
	systemIntakeID uuid.UUID,
	projectTitle string,
	requesterName string,
	requesterComponent string,
) error {
	if projectTitle == "" {
		projectTitle = "Draft System Intake"
	}
	subject := "GRB Review: You are invited to review documentation in EASi"
	body, err := sie.createGRBReviewerBody(systemIntakeID, projectTitle, requesterName, requesterComponent)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithBCCAddresses(recipients).
			WithSubject(subject).
			WithBody(body),
	)
}
