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

type newDocument struct {
	DocumentType string
	RequestName  string
	RequestLink  string
}

func stringifyDocumentType(commonType models.AccessibilityRequestDocumentCommonType, otherType string) string {
	switch commonType {
	case models.AccessibilityRequestDocumentCommonTypeAwardedVpat:
		return "Awarded VPAT"
	case models.AccessibilityRequestDocumentCommonTypeTestPlan:
		return "Test plan"
	case models.AccessibilityRequestDocumentCommonTypeRemediationPlan:
		return "Remediation plan"
	case models.AccessibilityRequestDocumentCommonTypeTestingVpat:
		return "Testing VPAT"
	case models.AccessibilityRequestDocumentCommonTypeTestResults:
		return "Test results"
	case models.AccessibilityRequestDocumentCommonTypeOther:
		return otherType
	default:
		return ""
	}
}

func (c Client) newDocumentBody(
	commonType models.AccessibilityRequestDocumentCommonType,
	otherType string,
	requestName string,
	requestID uuid.UUID,
) (string, error) {
	requestPath := path.Join("508", "requests", requestID.String(), "documents")
	data := newDocument{
		DocumentType: stringifyDocumentType(commonType, otherType),
		RequestName:  requestName,
		RequestLink:  c.urlFromPath(requestPath),
	}
	var b bytes.Buffer
	if c.templates.newAccessibilityRequestTemplate == nil {
		return "", errors.New("email template is nil")
	}
	err := c.templates.newDocumentTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// sendNewDocumentEmail sends an email for a new 508 request document
func (c Client) sendNewDocumentEmail(
	ctx context.Context,
	commonType models.AccessibilityRequestDocumentCommonType,
	otherType string,
	requestName string,
	requestID uuid.UUID,
	recipient models.EmailAddress,
) error {
	subject := fmt.Sprintf("508 testing request: Documents uploaded for %s", requestName)
	body, err := c.newDocumentBody(commonType, otherType, requestName, requestID)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	err = c.sender.Send(
		ctx,
		recipient,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}

// SendNewDocumentEmailsToReviewTeamAndRequester sends identical emails about new documents to the 508 team and the requester
func (c Client) SendNewDocumentEmailsToReviewTeamAndRequester(
	ctx context.Context,
	commonType models.AccessibilityRequestDocumentCommonType,
	otherType string,
	requestName string,
	requestID uuid.UUID,
	requesterEmail models.EmailAddress,
) error {
	if err := c.sendNewDocumentEmail(ctx, commonType, otherType, requestName, requestID, c.config.AccessibilityTeamEmail); err != nil {
		return err
	}
	return c.sendNewDocumentEmail(ctx, commonType, otherType, requestName, requestID, requesterEmail)
}
