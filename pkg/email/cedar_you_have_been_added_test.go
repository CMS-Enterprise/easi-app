package email

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
