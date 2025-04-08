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

type systemIntakeGRBReviewRestartedParameters struct {
	ProjectTitle            string
	SystemIntakeRequestLink string
	RequesterName           string
	ComponentAcronym        string
	GRBReviewStart          string
	GRBReviewDeadline       string
	GRBReviewEndDate        string
}

func (sie systemIntakeEmails) systemIntakeGRBReviewRestartedBody(
	systemIntakeID uuid.UUID,
	projectTitle string,
	requesterName string,
	componentAcronym string,
	grbReviewStart time.Time,
	grbReviewDeadline time.Time,
	grbReviewEndDate time.Time,
) (string, error) {
	requestLink := sie.client.urlFromPath(path.Join("governance-task-list", systemIntakeID.String()))

	data := systemIntakeGRBReviewRestartedParameters{
		ProjectTitle:            projectTitle,
		SystemIntakeRequestLink: requestLink,
		RequesterName:           requesterName,
		ComponentAcronym:        componentAcronym,
		GRBReviewStart:          grbReviewStart.Format("01/02/2006"),
		GRBReviewDeadline:       grbReviewDeadline.Format("01/02/2006"),
		GRBReviewEndDate:        grbReviewEndDate.Format("01/02/2006"),
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeGRBReviewRestartedTemplate == nil {
		return "", errors.New("systemIntakeGRBReviewRestarted template is not defined")
	}

	err := sie.client.templates.systemIntakeGRBReviewRestartedTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSystemIntakeGRBReviewRestarted sends an email to notify recipients that the GRB review has been restarted
func (sie systemIntakeEmails) SendSystemIntakeGRBReviewRestarted(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	projectTitle string,
	requesterName string,
	componentAcronym string,
	grbReviewStart time.Time,
	grbReviewDeadline time.Time,
	grbReviewEndDate time.Time,
) error {
	subject := fmt.Sprintf("The GRB review for %s was restarted", projectTitle)

	body, err := sie.systemIntakeGRBReviewRestartedBody(
		systemIntakeID,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart,
		grbReviewDeadline,
		grbReviewEndDate,
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
