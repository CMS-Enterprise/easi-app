package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type cedarRolesChangedEmailParameters struct {
	RequesterFullName   string
	TargetFullName      string
	DidAdd              bool
	DidDelete           bool
	RoleTypeNamesBefore string
	RoleTypeNamesAfter  string
	SystemName          string
	Timestamp           string
}

func (c Client) cedarRolesChangedEmailBody(requesterFullName string, targetFullName string, didAdd bool, didDelete bool, roleTypeNamesBefore []string, roleTypeNamesAfter []string, systemName string, timestamp time.Time) (string, error) {
	data := cedarRolesChangedEmailParameters{
		RequesterFullName:   requesterFullName,
		TargetFullName:      targetFullName,
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
	requesterFullName string,
	targetFullName string,
	didAdd bool,
	didDelete bool,
	roleTypeNamesBefore []string,
	roleTypeNamesAfter []string,
	systemName string,
	timestamp time.Time,
) error {
	subject := fmt.Sprintf("CEDAR Roles modified for (%v)", targetFullName)
	body, err := c.cedarRolesChangedEmailBody(requesterFullName, targetFullName, didAdd, didDelete, roleTypeNamesBefore, roleTypeNamesAfter, systemName, timestamp)
	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{c.config.CEDARTeamEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
