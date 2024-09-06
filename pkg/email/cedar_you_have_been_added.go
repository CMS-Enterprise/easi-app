package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"strings"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type cedarYouHaveBeenAddedEmailParameters struct {
	SystemName          string
	SystemID            uuid.UUID
	Roles               string
	SystemWorkspaceLink string
	TeamLink            string
}

func (c Client) cedarYouHaveBeenAddedEmailBody(systemName string, systemID uuid.UUID, roles []string) (string, error) {

	var roleString string

	switch len(roles) {
	case 0:
		roleString = "Team Member"
	case 1:
		roleString = roles[0]
	case 2:
		// first and second
		roleString = strings.Join(roles, " and ")
	default:
		// first, second, third, and fourth
		roleString = fmt.Sprintf("%[1]s, and %[2]s",
			strings.Join(roles[:len(roles)-1], ", "),
			roles[len(roles)-1])
	}

	data := cedarYouHaveBeenAddedEmailParameters{
		SystemName:          systemName,
		Roles:               roleString,
		SystemWorkspaceLink: c.urlFromPath(path.Join("systems", systemID.String(), "workspace")),
		TeamLink:            c.urlFromPath(path.Join("systems", systemID.String(), "team", "edit", "team-member")),
	}

	if c.templates.cedarYouHaveBeenAdded == nil {
		return "", errors.New("CEDAR You Have Been Added template is nil")
	}

	var b bytes.Buffer
	if err := c.templates.cedarYouHaveBeenAdded.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (c Client) SendCedarYouHaveBeenAddedEmail(
	ctx context.Context,
	systemName string,
	systemID uuid.UUID,
	roles []string,
	teamMemberEmail models.EmailAddress,
) error {
	subject := fmt.Sprintf("You have been added as a team member for %s", systemName)
	body, err := c.cedarYouHaveBeenAddedEmailBody(systemName, systemID, roles)
	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{teamMemberEmail}).
			WithSubject(subject).
			WithBody(body),
	)
}
