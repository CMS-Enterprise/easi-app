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
	if sie.client.templates.systemIntakeAdminUploadDocTemplate == nil {
		return "", errors.New("system intake admin upload doc template is nil")
	}

	link := path.Join("it-governance", input.SystemIntakeID.String(), "grb-review")

	data := systemIntakeAdminUploadDocBody{
		RequestName:              input.RequestName,
		RequesterName:            input.RequesterName,
		RequestComponent:         input.RequesterComponent,
		Link:                     sie.client.urlFromPath(link),
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
			WithCCAddresses([]models.EmailAddress{sie.client.config.GRTEmail}).
			WithBCCAddresses(input.Recipients).
			WithSubject(subject).
			WithBody(body),
	)
}
