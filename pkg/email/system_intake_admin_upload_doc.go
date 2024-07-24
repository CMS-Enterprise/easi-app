package email

import (
	"bytes"
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SendSystemIntakeAdminUploadDocEmailInput struct {
	SystemIntakeID     uuid.UUID
	RequestName        string
	RequesterName      string
	RequesterComponent string
	Recipients         []models.EmailAddress
}

type systemIntakeAdminUploadDocBody struct {
	RequestName              string
	RequesterName            string
	RequesterComponent       string
	SystemIntakeAdminLink    string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) systemIntakeAdminUploadDocBody(input SendSystemIntakeAdminUploadDocEmailInput) (string, error) {
	intakePath := path.Join("governance-task-list", input.SystemIntakeID.String())

	data := systemIntakeAdminUploadDocBody{
		RequestName:              input.RequestName,
		RequesterName:            input.RequesterName,
		RequesterComponent:       input.RequesterComponent,
		SystemIntakeAdminLink:    sie.client.urlFromPath(intakePath),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
	}

	var b bytes.Buffer
	if err := sie.client.templates.systemIntakeAdminUploadDocTemplate.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendSystemIntakeAdminUploadDocEmail(ctx context.Context, input SendSystemIntakeAdminUploadDocEmailInput) error {
	if len(input.RequestName) < 1 {
		input.RequestName = "Draft System Intake"
	}

	subject := fmt.Sprintf("New documents have been added to the GRB review for %s", input.RequestName)

	body, err := sie.systemIntakeAdminUploadDocBody(input)
	if err != nil {
		return err
	}

	return sie.client.sender.Send(ctx,
		NewEmail().
			WithBccAddresses(input.Recipients).
			WithSubject(subject).
			WithBody(body),
	)
}
