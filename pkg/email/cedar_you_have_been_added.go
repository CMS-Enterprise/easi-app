package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"strings"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type cedarYouHaveBeenAddedEmailParameters struct {
	SystemName          string
	Roles               string
	SystemWorkspaceLink string
	TeamLink            string
}

func (c Client) cedarYouHaveBeenAddedEmailBody(systemName string, systemID string, roles []string) (string, error) {
	if c.templates.cedarYouHaveBeenAdded == nil {
		return "", errors.New("CEDAR You Have Been Added template is nil")
	}

	data := cedarYouHaveBeenAddedEmailParameters{
		SystemName:          systemName,
		Roles:               buildRoleString(roles),
		SystemWorkspaceLink: c.urlFromPath(path.Join("systems", systemID, "workspace")),
		TeamLink:            c.urlFromPath(path.Join("systems", systemID, "team", "edit", "team-member")),
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
	systemID string,
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

func buildRoleString(roles []string) string {
	switch len(roles) {
	case 0:
		return "Team Member"
	case 1:
		return roles[0]
	case 2:
		// first and second
		return strings.Join(roles, " and ")
	default:
		// first, second, third, and fourth
		return fmt.Sprintf("%[1]s, and %[2]s",
			strings.Join(roles[:len(roles)-1], ", "),
			roles[len(roles)-1])
	}
}
