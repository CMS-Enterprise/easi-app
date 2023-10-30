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

type businessCaseSubmissionRequester struct {
	BusinessCaseLink string
	RequestName      string
}

type businessCaseSubmissionReviewer struct {
	BusinessCaseLink string
	RequestName      string
}

func (sie systemIntakeEmails) businessCaseSubmissionRequesterBody(systemIntakeID uuid.UUID, requestName string) (string, error) {
	businessCasePath := path.Join("governance-review-team", systemIntakeID.String(), "business-case")
	data := businessCaseSubmissionRequester{
		BusinessCaseLink: sie.client.urlFromPath(businessCasePath),
		RequestName:      requestName,
	}
	var b bytes.Buffer
	if sie.client.templates.systemIntakeSubmitBusinessCaseRequesterTemplate == nil {
		return "", errors.New("submit business case requester template is nil")
	}
	err := sie.client.templates.systemIntakeSubmitBusinessCaseRequesterTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSubmitBizCaseRequesterNotification sends an email for a submitted business case
func (sie systemIntakeEmails) SendSubmitBizCaseRequesterNotification(ctx context.Context, requestName string, systemIntakeID uuid.UUID) error {
	// TODO: maybe we should check if intake status is DRAFT and format accordingly (i.e. New Biz Case vs New Draft Biz Case)
	//       similar to how request_withdraw checks if it is an unnamed request
	subject := fmt.Sprintf("New Business Case: %s", requestName)
	body, err := sie.businessCaseSubmissionRequesterBody(systemIntakeID, requestName)
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

func (sie systemIntakeEmails) businessCaseSubmissionReviewerBody(systemIntakeID uuid.UUID, requestName string) (string, error) {
	businessCasePath := path.Join("governance-review-team", systemIntakeID.String(), "business-case")
	data := businessCaseSubmissionReviewer{
		BusinessCaseLink: sie.client.urlFromPath(businessCasePath),
		RequestName:      requestName,
	}
	var b bytes.Buffer
	if sie.client.templates.systemIntakeSubmitBusinessCaseReviewerTemplate == nil {
		return "", errors.New("submit business case reviewer template is nil")
	}
	err := sie.client.templates.systemIntakeSubmitBusinessCaseReviewerTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSubmitBizCaseReviewerNotification sends an email for a submitted business case
func (sie systemIntakeEmails) SendSubmitBizCaseReviewerNotification(ctx context.Context, requestName string, systemIntakeID uuid.UUID) error {
	// TODO: maybe we should check if intake status is DRAFT and format accordingly (i.e. New Biz Case vs New Draft Biz Case)
	//       similar to how request_withdraw checks if it is an unnamed request
	subject := fmt.Sprintf("New Business Case: %s", requestName)
	body, err := sie.businessCaseSubmissionReviewerBody(systemIntakeID, requestName)
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
