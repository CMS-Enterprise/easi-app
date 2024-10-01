package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendCedarNewTeamMemberEmail() {
	ms := mockSender{}
	ctx := context.Background()

	memberName := "New Test Member"
	systemName := "Test System Name"
	rolesList := []string{"Role 1", "Role 2", "Role 3"}
	roles := buildRoleString(rolesList)
	systemID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")

	workspaceLink := fmt.Sprintf("%[1]s://%[2]s/systems/%[3]s/workspace",
		s.config.URLScheme,
		s.config.URLHost,
		systemID.String(),
	)
	teamLink := fmt.Sprintf("%[1]s://%[2]s/systems/%[3]s/team/edit/team-member",
		s.config.URLScheme,
		s.config.URLHost,
		systemID.String(),
	)

	existingTeamMembers := []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test2@fake.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
	}

	expectedBody := fmt.Sprintf(`<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>%[1]s is now listed as %[2]s for %[3]s in EASi. They can use EASi to access and manage information about team members, governance requests, and other information about the system.</p>

	<p>If you believe this was an error, you may remove them from the <a href="%[4]s">Team space</a> of this system's workspace.</p>

	<a href="%[5]s">Visit this system's workspace in EASi</a>`,
		memberName,
		roles,
		systemName,
		teamLink,
		workspaceLink,
	)

	s.Run("successful New team Member email has the right content", func() {
		client, err := NewClient(s.config, &ms)
		s.NoError(err)

		err = client.SendCedarNewTeamMemberEmail(
			ctx,
			memberName,
			"test@fake.com",
			systemName,
			systemID.String(),
			rolesList,
			existingTeamMembers,
		)
		s.NoError(err)

		expectedSubject := fmt.Sprintf("%[1]s has been added as a team member for %[2]s", memberName, systemName)
		s.Equal(expectedSubject, ms.subject)

		s.EqualHTML(expectedBody, ms.body)
	})
}

func (s *EmailTestSuite) TestDetermineProjectLeads() {
	// with one project lead
	roles := []*models.CedarRole{{
		AssigneeEmail: zero.StringFrom("test1@ok.com"),
		RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
	}}

	out := determineProjectLeadEmails(roles, "")
	s.Len(out, 1)
	s.Equal(out[0].String(), "test1@ok.com")

	// with more than one project lead
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "")
	s.Len(out, 2)
	s.Equal(out[0].String(), "test1@ok.com")
	s.Equal(out[1].String(), "test2@ok.com")

	// with more than one project lead where one of the leads is the new team member
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "test1@ok.com")
	s.Len(out, 1)
	s.Equal(out[0].String(), "test2@ok.com")

	// with no project leads but has GTL roles
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "")
	s.Len(out, 2)
	s.Equal(out[0].String(), "test1@ok.com")
	s.Equal(out[1].String(), "test2@ok.com")

	// with no project leads but has GTL roles, one of which is the new team member
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "test1@ok.com")
	s.Len(out, 1)
	s.Equal(out[0].String(), "test2@ok.com")

	// with no project leads, no GTL roles, but has COR roles
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.CORRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.CORRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "")
	s.Len(out, 2)
	s.Equal(out[0].String(), "test1@ok.com")
	s.Equal(out[1].String(), "test2@ok.com")

	// with no project leads, no GTL roles, but has COR roles, one of which is the new team member
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.CORRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.CORRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "test1@ok.com")
	s.Len(out, 1)
	s.Equal(out[0].String(), "test2@ok.com")

	// with one of each role
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test3@ok.com"),
			RoleTypeName:  zero.StringFrom(models.CORRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "")
	s.Len(out, 1)
	s.Equal(out[0].String(), "test1@ok.com")

	// with one of each role where the project lead is the new team member
	roles = []*models.CedarRole{
		{
			AssigneeEmail: zero.StringFrom("test1@ok.com"),
			RoleTypeName:  zero.StringFrom(models.ProjectLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test2@ok.com"),
			RoleTypeName:  zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		},
		{
			AssigneeEmail: zero.StringFrom("test3@ok.com"),
			RoleTypeName:  zero.StringFrom(models.CORRole.String()),
		},
	}

	out = determineProjectLeadEmails(roles, "test1@ok.com")
	s.Len(out, 1)
	s.Equal(out[0].String(), "test2@ok.com")
}
