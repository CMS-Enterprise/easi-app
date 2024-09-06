package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
)

type cedarNewTeamMemberEmailParameters struct {
	MemberName          string
	SystemName          string
	Roles               string
	SystemWorkspaceLink string
	TeamLink            string
}

func (c Client) cedarNewTeamMemberEmailBody(memberName string, systemName string, systemID string, roles []string) (string, error) {
	if c.templates.cedarNewTeamMember == nil {
		return "", errors.New("CEDAR New Team Member template is nil")
	}

	data := cedarNewTeamMemberEmailParameters{
		MemberName:          memberName,
		SystemName:          systemName,
		Roles:               buildRoleString(roles),
		SystemWorkspaceLink: c.urlFromPath(path.Join("systems", systemID, "workspace")),
		TeamLink:            c.urlFromPath(path.Join("systems", systemID, "team", "edit", "team-member")),
	}

	var b bytes.Buffer
	if err := c.templates.cedarNewTeamMember.Execute(&b, data); err != nil {
		return "", err
	}

	return b.String(), nil
}

func (c Client) SendCedarNewTeamMemberEmail(
	ctx context.Context,
	memberName string,
	systemName string,
	systemID string,
	roles []string,
) error {
	subject := fmt.Sprintf("%[1]s has been added as a team member for %[2]s", memberName, systemName)
	body, err := c.cedarNewTeamMemberEmailBody(memberName, systemName, systemID, roles)
	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(nil).
			WithSubject(subject).
			WithBody(body),
	)
}
