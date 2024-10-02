package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"
)

func (s *EmailTestSuite) TestSendCedarYouHaveBeenAddedEmail() {
	ms := mockSender{}
	ctx := context.Background()

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

	expectedBody := fmt.Sprintf(`<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>


<p>You are now listed as %[1]s for %[2]s in EASi. You can use EASi to access and manage information about
  team members, governance requests, and other information about your system.</p>

<a href="%[3]s">Visit your system's workspace in EASi</a>

<p>If you believe this was an error, you may remove yourself from the <a href="%[4]s">Team space</a> of this
  system's workspace.</p>`,
		roles,
		systemName,
		workspaceLink,
		teamLink,
	)

	s.Run("successful You Have Been Added email has the right content", func() {
		client, err := NewClient(s.config, &ms)
		s.NoError(err)

		err = client.SendCedarYouHaveBeenAddedEmail(ctx, systemName, systemID.String(), rolesList, "test@fake.com")
		s.NoError(err)

		expectedSubject := fmt.Sprintf("You have been added as a team member for %s", systemName)
		s.Equal(expectedSubject, ms.subject)

		s.EqualHTML(expectedBody, ms.body)
	})
}

func (s *EmailTestSuite) TestBuildRoleString() {
	s.Run("successfully returns Team Member when no roles listed", func() {
		res := buildRoleString(nil)

		s.Equal(res, "Team Member")
	})

	s.Run("successfully returns the role when a single role is passed", func() {
		res := buildRoleString([]string{"Captain"})

		s.Equal(res, "Captain")
	})

	s.Run("successfully returns for two roles", func() {
		res := buildRoleString([]string{"Captain", "Private"})

		s.Equal(res, "Captain and Private")
	})

	s.Run("successfully returns for three or more roles", func() {
		res := buildRoleString([]string{"Captain", "Private", "Sergeant"})

		s.Equal(res, "Captain, Private, and Sergeant")

		res = buildRoleString([]string{"Captain", "Private", "Sergeant", "Hello", "World"})

		s.Equal(res, "Captain, Private, Sergeant, Hello, and World")
	})
}
