package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

type cedarRolesChangedEmailParameters struct {
	UserFullName        string
	DidAdd              bool
	DidDelete           bool
	RoleTypeNamesBefore string
	RoleTypeNamesAfter  string
	SystemName          string
	Timestamp           string
}

func (c Client) cedarRolesChangedEmailBody(userFullName string, didAdd bool, didDelete bool, roleTypeNamesBefore []string, roleTypeNamesAfter []string, systemName string, timestamp time.Time) (string, error) {
	data := cedarRolesChangedEmailParameters{
		UserFullName:        userFullName,
		DidAdd:              didAdd,
		DidDelete:           didDelete,
		RoleTypeNamesBefore: strings.Join(roleTypeNamesBefore, ", "),
		RoleTypeNamesAfter:  strings.Join(roleTypeNamesAfter, ", "),
		SystemName:          systemName,
		Timestamp:           timestamp.Format(time.RFC822),
	}

	var b bytes.Buffer
	if c.templates.cedarRolesChanged == nil {
		return "", errors.New("CEDAR Roles changed template is nil")
	}

	err := c.templates.cedarRolesChanged.Execute(&b, data)
	if err != nil {
		return "", err
	}

	return b.String(), nil
}

// SendCedarRolesChangedEmail notifies someone that they've been added as an attendee on a TRB request
func (c Client) SendCedarRolesChangedEmail(
	ctx context.Context,
	userFullName string,
	didAdd bool,
	didDelete bool,
	roleTypeNamesBefore []string,
	roleTypeNamesAfter []string,
	systemName string,
	timestamp time.Time,
) error {
	subject := fmt.Sprintf("CEDAR Roles modified for (%v)", userFullName)
	body, err := c.cedarRolesChangedEmailBody(userFullName, didAdd, didDelete, roleTypeNamesBefore, roleTypeNamesAfter, systemName, timestamp)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		[]models.EmailAddress{c.config.CEDARTeamEmail},
		[]models.EmailAddress{},
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
