package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"github.com/cms-enterprise/easi-app/pkg/models"
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
	newTeamMemberName string,
	newTeamMemberEmail string,
	systemName string,
	systemID string,
	roles []string,
	systemDetails *models.CedarSystemDetails,
) error {
	subject := fmt.Sprintf("%[1]s has been added as a team member for %[2]s", newTeamMemberName, systemName)
	body, err := c.cedarNewTeamMemberEmailBody(newTeamMemberName, systemName, systemID, roles)
	if err != nil {
		return err
	}

	var recipients []models.EmailAddress

	// find our project lead first
	projectLeadEmail := determineProjectLeadEmail(systemDetails.Roles)
	if len(projectLeadEmail) > 0 {
		recipients = append(recipients, projectLeadEmail)
	}

	// look for the rest of the roles
	for _, role := range systemDetails.Roles {
		if role == nil {
			continue
		}

		// do not send to the new team member
		if role.AssigneeEmail.String == newTeamMemberEmail {
			continue
		}

		if role.RoleTypeName.String == "Survey Point of Contact" {
			recipients = append(recipients, models.NewEmailAddress(role.AssigneeEmail.String))
			continue
		}

		if role.RoleTypeName.String == "Business Owner" {
			recipients = append(recipients, models.NewEmailAddress(role.AssigneeEmail.String))
			continue
		}
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(recipients).
			WithSubject(subject).
			WithBody(body),
	)
}

func determineProjectLeadEmail(roles []*models.CedarRole) models.EmailAddress {
	// we want to send to the Project Lead, Survey Point of Contact, and Business Owner
	// * if no Project Lead, use Government Task Lead (GTL)
	// * if no Government Task Lead (GTL), use Contracting Officer's Representative (COR)

	var currBest models.EmailAddress

	for _, role := range roles {
		if role == nil {
			continue
		}

		switch role.RoleTypeName.String {
		case "Project Lead":
			// ideal situation
			return models.NewEmailAddress(role.AssigneeEmail.String)

		case "Government Task Lead (GTL)":
			// second-best situation
			currBest = models.NewEmailAddress(role.AssigneeEmail.String)

		case "Contracting Officer's Representative (COR)":
			// third-best situation
			// do not override if currBest is already filled in
			if len(currBest) < 1 {
				currBest = models.NewEmailAddress(role.AssigneeEmail.String)
			}
		}
	}

	return currBest
}
