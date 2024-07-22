package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type businessCaseSubmissionRequester struct {
	RequestName              string
	PreparingForGRBLink      string
	SystemIntakeRequestLink  string
	ITGovernanceInboxAddress string
	IsResubmitted            bool
	IsDraft                  bool
}

type businessCaseSubmissionReviewer struct {
	RequesterName         string
	RequestName           string
	BusinessCaseAdminLink string
	IsResubmitted         bool
	IsDraft               bool
}

func (sie systemIntakeEmails) businessCaseSubmissionRequesterBody(
	systemIntakeID uuid.UUID,
	requestName string,
	isResubmitted bool,
	isDraft bool,
) (string, error) {
	requesterPath := path.Join("governance-task-list", systemIntakeID.String())
	preparingForGRBPath := path.Join("help", "it-governance", "prepare-for-grb")
	data := businessCaseSubmissionRequester{
		RequestName:              requestName,
		PreparingForGRBLink:      sie.client.urlFromPath(preparingForGRBPath),
		SystemIntakeRequestLink:  sie.client.urlFromPath(requesterPath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
		IsResubmitted:            isResubmitted,
		IsDraft:                  isDraft,
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
func (sie systemIntakeEmails) SendSubmitBizCaseRequesterNotification(
	ctx context.Context,
	requesterEmailAddress models.EmailAddress,
	requestName string,
	systemIntakeID uuid.UUID,
	isResubmitted bool,
	isDraft bool,
) error {
	draftOrFinal := "final"
	if isDraft {
		draftOrFinal = "draft"
	}
	subject := fmt.Sprintf(
		"Your %s Business Case has been submitted (%s)",
		draftOrFinal,
		requestName,
	)
	if isResubmitted {
		subject = fmt.Sprintf(
			"Your %s Business Case has been resubmitted with changes (%s)",
			draftOrFinal,
			requestName,
		)
	}
	body, err := sie.businessCaseSubmissionRequesterBody(
		systemIntakeID,
		requestName,
		isResubmitted,
		isDraft,
	)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{requesterEmailAddress}).
			WithSubject(subject).
			WithBody(body),
	)
}

func (sie systemIntakeEmails) businessCaseSubmissionReviewerBody(
	systemIntakeID uuid.UUID,
	requesterName string,
	requestName string,
	isResubmitted bool,
	isDraft bool,
) (string, error) {
	businessCasePath := path.Join("governance-review-team", systemIntakeID.String(), "business-case")
	data := businessCaseSubmissionReviewer{
		RequesterName:         requesterName,
		RequestName:           requestName,
		BusinessCaseAdminLink: sie.client.urlFromPath(businessCasePath),
		IsResubmitted:         isResubmitted,
		IsDraft:               isDraft,
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
func (sie systemIntakeEmails) SendSubmitBizCaseReviewerNotification(
	ctx context.Context,
	systemIntakeID uuid.UUID,
	requesterName string,
	requestName string,
	isResubmitted bool,
	isDraft bool,
) error {
	draftOrFinal := "final"
	if isDraft {
		draftOrFinal = "draft"
	}
	subject := fmt.Sprintf(
		"A %s Business Case has been submitted (%s)",
		draftOrFinal,
		requestName,
	)
	if isResubmitted {
		subject = fmt.Sprintf(
			"Changes made to %s Business Case (%s)",
			draftOrFinal,
			requestName,
		)
	}

	body, err := sie.businessCaseSubmissionReviewerBody(
		systemIntakeID,
		requesterName,
		requestName,
		isResubmitted,
		isDraft,
	)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
