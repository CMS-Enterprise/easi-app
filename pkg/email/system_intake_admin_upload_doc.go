package email

import (
	"bytes"
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"
)

type SendSystemIntakeAdminUploadDocEmailInput struct {
	SystemIntakeID     uuid.UUID
	RequestName        string
	RequesterName      string
	RequesterComponent string
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
		SystemIntakeAdminLink:    intakePath,
		RequesterName:            "",
		RequesterComponent:       "",
		ITGovernanceInboxAddress: sie.client.urlFromPath(intakePath),
	}

	var b bytes.Buffer
	if err := sie.client.templates.systemIntakeAdminUploadDocTemplate.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (sie systemIntakeEmails) SendSystemIntakeAdminUploadDocBody(ctx context.Context, requestName string) error {
	subject := fmt.Sprintf("New documents have been added to the GRB review for %s", requestName)
}
