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
	RequestComponent         string
	Link                     string
	ITGovernanceInboxAddress string
}

func (sie systemIntakeEmails) systemIntakeAdminUploadDocBody(input SendSystemIntakeAdminUploadDocEmailInput) (string, error) {
	adminLink := path.Join("governance-task-list", input.SystemIntakeID.String())

	data := systemIntakeAdminUploadDocBody{
		RequestName:              input.RequestName,
		RequesterName:            input.RequesterName,
		RequestComponent:         input.RequesterComponent,
		Link:                     sie.client.urlFromPath(adminLink),
		ITGovernanceInboxAddress: sie.client.config.GRTEmail.String(),
	}

	if sie.client.templates.systemIntakeAdminUploadDocTemplate == nil {
		return "", errors.New("system intake admin upload doc template is nil")
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
			WithBCCAddresses(append(input.Recipients, sie.client.config.GRTEmail)).
			WithSubject(subject).
			WithBody(body),
	)
}
