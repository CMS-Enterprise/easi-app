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

type submitInitialFormRequesterBody struct {
	RequestName              string
	IsResubmitted            bool
	SystemIntakeRequestLink  string
	ITGovernanceInboxAddress string
}

type submitInitialFormReviewerBody struct {
	RequesterName         string
	IsResubmitted         bool
	RequestName           string
	RequesterComponent    string
	RequestType           string
	ProcessStage          string
	SystemIntakeAdminLink string
}

func (sie systemIntakeEmails) submitInitialFormRequesterBody(
	systemIntakeID uuid.UUID,
	requestName string,
	isResubmitted bool,
) (string, error) {
	intakePath := path.Join("governance-task-list", systemIntakeID.String())
	data := submitInitialFormRequesterBody{
		RequestName:              requestName,
		IsResubmitted:            isResubmitted,
		SystemIntakeRequestLink:  sie.client.urlFromPath(intakePath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
	}
	var b bytes.Buffer
	if sie.client.templates.systemIntakeSubmitInitialFormRequesterTemplate == nil {
		return "", errors.New("system intake submission requester template is nil")
	}
	err := sie.client.templates.systemIntakeSubmitInitialFormRequesterTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSubmitInitialFormRequesterNotification sends an email to the requester for a submitted system intake
func (sie systemIntakeEmails) SendSubmitInitialFormRequesterNotification(
	ctx context.Context,
	requesterEmail models.EmailAddress,
	intakeID uuid.UUID,
	requestName string,
	isResubmitted bool,
) error {
	if requestName == "" {
		requestName = "Draft System Intake"
	}
	var submittedText string
	if isResubmitted {
		submittedText = "resubmitted with changes"
	} else {
		submittedText = "submitted"
	}
	subject := fmt.Sprintf("Your Intake Request form has been %s (%s)", submittedText, requestName)
	body, err := sie.submitInitialFormRequesterBody(
		intakeID,
		requestName,
		isResubmitted,
	)
	if err != nil {
		return err
	}
	return sie.client.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{requesterEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}

func (sie systemIntakeEmails) submitInitialFormReviewerBody(
	systemIntakeID uuid.UUID,
	requestName string,
	requesterName string,
	requesterComponent string,
	requestType models.SystemIntakeRequestType,
	processStage string,
	isResubmitted bool,
) (string, error) {
	adminPath := path.Join("governance-review-team", systemIntakeID.String(), "intake-request")
	data := submitInitialFormReviewerBody{
		RequesterName:         requesterName,
		IsResubmitted:         isResubmitted,
		RequestName:           requestName,
		RequesterComponent:    requesterComponent,
		RequestType:           HumanizeSnakeCase(string(requestType)),
		ProcessStage:          processStage,
		SystemIntakeAdminLink: sie.client.urlFromPath(adminPath),
	}
	var b bytes.Buffer
	if sie.client.templates.systemIntakeSubmitInitialFormReviewerTemplate == nil {
		return "", errors.New("system intake submission reviewer template is nil")
	}
	err := sie.client.templates.systemIntakeSubmitInitialFormReviewerTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendSubmitInitialFormReviewerNotification sends an email to the reviewer for a submitted system intake
func (sie systemIntakeEmails) SendSubmitInitialFormReviewerNotification(
	ctx context.Context,
	intakeID uuid.UUID,
	requestName string,
	requesterName string,
	requesterComponent string,
	requestType models.SystemIntakeRequestType,
	processStage string,
	isResubmitted bool,
) error {
	if requestName == "" {
		requestName = "Draft System Intake"
	}
	var subject string
	if isResubmitted {
		subject = fmt.Sprintf("Changes made to Intake Request (%s)", requestName)
	} else {
		subject = fmt.Sprintf("A new Intake Request has been submitted (%s)", requestName)
	}

	body, err := sie.submitInitialFormReviewerBody(
		intakeID,
		requestName,
		requesterName,
		requesterComponent,
		requestType,
		processStage,
		isResubmitted,
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
