package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type submitInitialFormRequesterBody struct {
	IntakeLink  string
	RequestName string
}

type submitInitialFormReviewerBody struct {
	IntakeLink  string
	RequestName string
}

func (sie systemIntakeEmails) submitInitialFormRequesterBody(intakeID uuid.UUID, requestName string) (string, error) {
	intakePath := path.Join("governance-review-team", intakeID.String(), "intake-request")
	data := submitInitialFormRequesterBody{
		IntakeLink:  sie.client.urlFromPath(intakePath),
		RequestName: requestName,
	}
	var b bytes.Buffer
	if sie.client.templates.systemIntakeSubmitInitialFormRequesterTemplate == nil {
		return "", errors.New("system intake submission template is nil")
	}
	err := sie.client.templates.systemIntakeSubmitInitialFormRequesterTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSubmitInitialFormRequesterNotification sends an email to the requester for a submitted system intake
func (sie systemIntakeEmails) SendSubmitInitialFormRequesterNotification(ctx context.Context, requestName string, intakeID uuid.UUID) error {
	subject := fmt.Sprintf("New intake request: %s", requestName)
	body, err := sie.submitInitialFormRequesterBody(intakeID, requestName)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = sie.client.sender.Send(
		ctx,
		[]models.EmailAddress{sie.client.config.GRTEmail},
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}

func (sie systemIntakeEmails) submitInitialFormReviewerBody(intakeID uuid.UUID, requestName string) (string, error) {
	intakePath := path.Join("governance-review-team", intakeID.String(), "intake-request")
	data := submitInitialFormReviewerBody{
		IntakeLink:  sie.client.urlFromPath(intakePath),
		RequestName: requestName,
	}
	var b bytes.Buffer
	if sie.client.templates.systemIntakeSubmitInitialFormReviewerTemplate == nil {
		return "", errors.New("system intake submission template is nil")
	}
	err := sie.client.templates.systemIntakeSubmitInitialFormReviewerTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSubmitInitialFormReviewerNotification sends an email to the reviewer for a submitted system intake
func (sie systemIntakeEmails) SendSubmitInitialFormReviewerNotification(ctx context.Context, requestName string, intakeID uuid.UUID) error {
	subject := fmt.Sprintf("New intake request: %s", requestName)
	body, err := sie.submitInitialFormReviewerBody(intakeID, requestName)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = sie.client.sender.Send(
		ctx,
		[]models.EmailAddress{sie.client.config.GRTEmail},
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
