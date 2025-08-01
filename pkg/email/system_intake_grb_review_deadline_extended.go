package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type systemIntakeGRBReviewDeadlineExtendedParameters struct {
	ProjectTitle             string
	RequesterName            string
	ComponentAcronym         string
	SystemIntakeRequestLink  string
	ITGovernanceInboxAddress string
	GRBHelpLink              string
	GRBReviewStart           string
	GRBReviewEnd             string
}

func (sie systemIntakeEmails) systemIntakeGRBReviewDeadlineExtendedBody(
	systemIntakeID uuid.UUID,
	projectTitle string,
	requesterName string,
	componentAcronym string,
	grbReviewStart time.Time,
	grbReviewEnd time.Time,
) (string, error) {
	if sie.client.templates.systemIntakeGRBReviewDeadlineExtendedTemplate == nil {
		return "", errors.New("systemIntakeGRBReviewDeadlineExtended template is not defined")
	}

	requesterURL := sie.client.urlFromPath(path.Join("governance-task-list", systemIntakeID.String()))

	data := systemIntakeGRBReviewDeadlineExtendedParameters{
		ProjectTitle:             projectTitle,
		RequesterName:            requesterName,
		ComponentAcronym:         componentAcronym,
		SystemIntakeRequestLink:  requesterURL,
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		GRBHelpLink:              sie.client.urlFromPath(path.Join("help", "it-governance", "prepare-for-grb")),
		GRBReviewStart:           grbReviewStart.Format("01/02/2006"),
		GRBReviewEnd:             grbReviewEnd.Format("01/02/2006"),
	}

	var b bytes.Buffer
	if err := sie.client.templates.systemIntakeGRBReviewDeadlineExtendedTemplate.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendSystemIntakeGRBReviewDeadlineExtended sends an email to the requester when the GRB review deadline is extended
func (sie systemIntakeEmails) SendSystemIntakeGRBReviewDeadlineExtended(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectTitle string,
	requesterName string,
	componentAcronym string,
	grbReviewStart time.Time,
	grbReviewEnd time.Time,
) error {
	subject := fmt.Sprintf("The Governance Admin Team has extended the deadline for this GRB review (%s)", projectTitle)

	body, err := sie.systemIntakeGRBReviewDeadlineExtendedBody(
		systemIntakeID,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart,
		grbReviewEnd,
	)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(sie.client.listAllRecipients(recipients)).
			WithSubject(subject).
			WithBody(body),
	)
}
