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

type systemIntakeGRBReviewTimeAddedParameters struct {
	AdminName               string
	TimeAdded               string
	ProjectTitle            string
	SystemIntakeRequestLink string
	RequesterName           string
	ComponentAcronym        string
	GRBReviewStart          string
	GRBReviewDeadline       string
	GRBReviewEndDate        string
	VoteTally               int
}

func (sie systemIntakeEmails) systemIntakeGRBReviewTimeAddedBody(
	systemIntakeID uuid.UUID,
	adminName string,
	timeAdded string,
	projectTitle string,
	requesterName string,
	componentAcronym string,
	grbReviewStart time.Time,
	grbReviewDeadline time.Time,
	grbReviewEndDate time.Time,
	voteTally int,
) (string, error) {
	requestLink := sie.client.urlFromPath(path.Join("governance-task-list", systemIntakeID.String()))

	data := systemIntakeGRBReviewTimeAddedParameters{
		AdminName:               adminName,
		TimeAdded:               timeAdded,
		ProjectTitle:            projectTitle,
		SystemIntakeRequestLink: requestLink,
		RequesterName:           requesterName,
		ComponentAcronym:        componentAcronym,
		GRBReviewStart:          grbReviewStart.Format("01/02/2006"),
		GRBReviewDeadline:       grbReviewDeadline.Format("01/02/2006"),
		GRBReviewEndDate:        grbReviewEndDate.Format("01/02/2006"),
		VoteTally:               voteTally,
	}

	var b bytes.Buffer
	if sie.client.templates.systemIntakeGRBReviewTimeAddedTemplate == nil {
		return "", errors.New("systemIntakeGRBReviewTimeAdded template is not defined")
	}

	err := sie.client.templates.systemIntakeGRBReviewTimeAddedTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSystemIntakeGRBReviewTimeAdded sends an email notifying that additional time has been added to the GRB review
func (sie systemIntakeEmails) SendSystemIntakeGRBReviewTimeAdded(
	ctx context.Context,
	recipients models.EmailNotificationRecipients,
	systemIntakeID uuid.UUID,
	adminName string,
	timeAdded string,
	projectTitle string,
	requesterName string,
	componentAcronym string,
	grbReviewStart time.Time,
	grbReviewDeadline time.Time,
	grbReviewEndDate time.Time,
	voteTally int,
) error {
	subject := fmt.Sprintf("Time was added to the GRB review for %s", projectTitle)

	body, err := sie.systemIntakeGRBReviewTimeAddedBody(
		systemIntakeID,
		adminName,
		timeAdded,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart,
		grbReviewDeadline,
		grbReviewEndDate,
		voteTally,
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
