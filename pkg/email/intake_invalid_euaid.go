package email

import (
	"bytes"
	"errors"
	"path"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
	"golang.org/x/net/context"
)

type intakeInvalidEUAID struct {
	ProjectName    string
	RequesterEUAID string
	IntakeID       string
	GRTIntakePath  string
}

func (c Client) intakeInvalidEUAIDBody(projectName string, requesterEUAID string, intakeID string, grtIntakePath string) (string, error) {
	data := intakeInvalidEUAID{
		ProjectName:    projectName,
		RequesterEUAID: requesterEUAID,
		IntakeID:       intakeID,
		GRTIntakePath:  c.urlFromPath(grtIntakePath),
	}

	var b bytes.Buffer
	if c.templates.intakeInvalidEUAIDTemplate == nil {
		return "", errors.New("system intake invalid EUAID template is nil")
	}
	err := c.templates.intakeInvalidEUAIDTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendIntakeInvalidEUAIDEmail sends a notification email to the GRT team when an intake request has an invalid EUA ID
func (c Client) SendIntakeInvalidEUAIDEmail(ctx context.Context, projectName string, requesterEUAID string, intakeID uuid.UUID) error {
	subject := "Unable to notify requester"
	grtIntakePath := path.Join("governance-review-team", intakeID.String(), "intake-request")

	body, err := c.intakeInvalidEUAIDBody(projectName, requesterEUAID, intakeID.String(), grtIntakePath)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, []models.EmailAddress{c.config.GRTEmail}, nil, subject, body)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
