package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
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
	existingTeamMembers []*models.CedarRole,
) error {

	subject := fmt.Sprintf("%[1]s has been added as a team member for %[2]s", newTeamMemberName, systemName)
	body, err := c.cedarNewTeamMemberEmailBody(newTeamMemberName, systemName, systemID, roles)
	if err != nil {
		return err
	}

	var recipients []models.EmailAddress

	// find our project lead first
	projectLeadEmails := determineProjectLeadEmail(existingTeamMembers, newTeamMemberEmail)
	if len(projectLeadEmails) > 0 {
		recipients = append(recipients, projectLeadEmails...)
	}

	// look for the rest of the roles
	for _, role := range existingTeamMembers {
		if role == nil {
			continue
		}

		// do not send to the new team member
		if role.AssigneeEmail.String == newTeamMemberEmail {
			continue
		}

		if role.RoleTypeName.String == models.SurveyPointOfContactRole.String() {
			recipients = append(recipients, models.NewEmailAddress(role.AssigneeEmail.String))
			continue
		}

		if role.RoleTypeName.String == models.BusinessOwnerRole.String() {
			recipients = append(recipients, models.NewEmailAddress(role.AssigneeEmail.String))
			continue
		}
	}

	if len(recipients) < 1 {
		appcontext.ZLogger(ctx).Info("no recipients found for new team member email", zap.String("SystemName", systemName))
		return nil
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses(recipients).
			WithSubject(subject).
			WithBody(body),
	)
}

func determineProjectLeadEmail(roles []*models.CedarRole, newTeamMemberEmail string) []models.EmailAddress {
	// we want to send to the Project Lead, Survey Point of Contact, and Business Owner
	// * if no Project Lead, use Government Task Lead (GTL)
	// * if no Government Task Lead (GTL), use Contracting Officer's Representative (COR)

	var (
		projectLeads        []models.EmailAddress
		governmentTaskLeads []models.EmailAddress
		corRoles            []models.EmailAddress
	)

	for _, role := range roles {
		if role == nil {
			continue
		}

		// do not send to the new team member
		if role.AssigneeEmail.String == newTeamMemberEmail {
			continue
		}

		switch role.RoleTypeName.String {
		case models.ProjectLeadRole.String():
			// ideal situation
			projectLeads = append(projectLeads, models.NewEmailAddress(role.AssigneeEmail.String))

		case models.GovernmentTaskLeadRole.String():
			// second-best situation
			governmentTaskLeads = append(governmentTaskLeads, models.NewEmailAddress(role.AssigneeEmail.String))

		case models.CORRole.String():
			// third-best situation
			corRoles = append(corRoles, models.NewEmailAddress(role.AssigneeEmail.String))
		}
	}

	if len(projectLeads) > 0 {
		return projectLeads
	}

	if len(governmentTaskLeads) > 0 {
		return governmentTaskLeads
	}

	return corRoles
}
