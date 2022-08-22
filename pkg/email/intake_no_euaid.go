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

type intakeNoEUAID struct {
	ProjectName   string
	IntakeID      string
	GRTIntakePath string
}

func (c Client) intakeNoEUAIDBody(projectName string, intakeID string, grtIntakePath string) (string, error) {
	data := intakeNoEUAID{
		ProjectName:   projectName,
		IntakeID:      intakeID,
		GRTIntakePath: c.urlFromPath(grtIntakePath),
	}

	var b bytes.Buffer
	if c.templates.intakeNoEUAIDTemplate == nil {
		return "", errors.New("system intake no EUAID template is nil")
	}
	err := c.templates.intakeNoEUAIDTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendIntakeNoEUAIDEmail sends a notification email to the GRT team when an intake request has no associated EUA ID
func (c Client) SendIntakeNoEUAIDEmail(ctx context.Context, projectName string, intakeID uuid.UUID) error {
	subject := "Unable to notify requester"
	grtIntakePath := path.Join("governance-review-team", intakeID.String(), "intake-request")

	body, err := c.intakeNoEUAIDBody(projectName, intakeID.String(), grtIntakePath)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, []models.EmailAddress{c.config.GRTEmail}, nil, subject, body)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
