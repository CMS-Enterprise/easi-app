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

type adminEmailParameters struct {
	RequestName   string
	RequesterName string
	Component     string
	RequestLink   string
}

func (c Client) trbRequestFormSubmissionAdminEmailBody(requestName string, requesterName string, component string) (string, error) {
	// TODO - EASI-2488 - put correct path here
	requestAdminViewPath := path.Join("TODO", "admin-view")

	data := adminEmailParameters{
		RequestName:   requestName,
		RequesterName: requesterName,
		Component:     component,
		RequestLink:   c.urlFromPath(requestAdminViewPath),
	}

	var b bytes.Buffer
	if c.templates.trbFormSubmittedAdmin == nil {
		return "", errors.New("TRB Form Submission Admin template is nil")
	}

	err := c.templates.trbFormSubmittedAdmin.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendTRBFormSubmissionNotificationToAdmins notifies the TRB admin mailbox that a TRB Request form has been submitted
func (c Client) SendTRBFormSubmissionNotificationToAdmins(ctx context.Context, requestName string, requesterName string, component string) error {
	subject := fmt.Sprintf("A new TRB Request has been submitted (%v)", requestName)
	body, err := c.trbRequestFormSubmissionAdminEmailBody(requestName, requesterName, component)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		[]models.EmailAddress{c.config.TRBEmail},
		[]models.EmailAddress{},
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}

type requesterEmailParameters struct {
	RequestName     string
	RequestLink     string
	TRBInboxAddress string
}

func (c Client) trbRequestFormSubmissionRequesterEmailBody(requestID uuid.UUID, requestName string) (string, error) {
	requestViewPath := path.Join("trb", "task-list", requestID.String())

	data := requesterEmailParameters{
		RequestName:     requestName,
		RequestLink:     c.urlFromPath(requestViewPath),
		TRBInboxAddress: c.config.TRBEmail.String(),
	}

	var b bytes.Buffer
	if c.templates.trbFormSubmittedRequester == nil {
		return "", errors.New("TRB Form Submission Requester template is nil")
	}

	err := c.templates.trbFormSubmittedRequester.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendTRBFormSubmissionNotificationToRequester notifies a TRB requester that their TRB Request form has been submitted
func (c Client) SendTRBFormSubmissionNotificationToRequester(
	ctx context.Context,
	requestID uuid.UUID,
	requestName string,
	requesterEmail models.EmailAddress,
	requesterName string,
) error {
	subject := fmt.Sprintf("Your TRB Request form has been submitted (%v)", requestName)
	body, err := c.trbRequestFormSubmissionRequesterEmailBody(requestID, requestName)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		[]models.EmailAddress{requesterEmail},
		[]models.EmailAddress{},
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
