package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type attendeeAddedEmailParameters struct {
	RequestName     string
	RequesterName   string
	TRBInboxAddress string
}

func (c Client) trbAttendeeAddedEmailBody(requestName string, requesterName string) (string, error) {
	data := attendeeAddedEmailParameters{
		RequestName:     requestName,
		RequesterName:   requesterName,
		TRBInboxAddress: c.config.TRBEmail.String(),
	}

	var b bytes.Buffer
	if c.templates.trbAttendeeAdded == nil {
		return "", errors.New("TRB Attendee Added template is nil")
	}

	err := c.templates.trbAttendeeAdded.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendTRBAttendeeAddedNotification notifies someone that they've been added as an attendee on a TRB request
func (c Client) SendTRBAttendeeAddedNotification(
	ctx context.Context,
	attendeeEmail models.EmailAddress,
	requestName string,
	requesterName string,
) error {
	subject := fmt.Sprintf("You are invited to the TRB consult for (%v)", requestName)
	body, err := c.trbAttendeeAddedEmailBody(requestName, requesterName)
	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{attendeeEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
