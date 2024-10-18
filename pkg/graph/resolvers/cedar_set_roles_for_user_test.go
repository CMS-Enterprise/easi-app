package resolvers

import (
	"github.com/samber/lo"

	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestCedarSetRolesForUser() {
	ctx := s.testConfigs.Context
	okta := local.NewOktaAPIClient()
	cedarClient := cedarcore.NewClient(ctx, "fake", "fake", "1.0.0", true, true)

	currentUserEUA := "ABCD"
	// currentUserInfo, err := okta.FetchUserInfo(ctx, "ABCD")
	// s.NoError(err)
	notCurrentUserEUA := "USR1"
	cedarSystemID := "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
	currentUserCurrentRoleID := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID02}"
	otherRoleID1 := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID03}"
	otherRoleID2 := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID04}"

	s.Run("Should send email to CEDAR even if no roles modified", func() {
		emailClient, sender := NewEmailClient()
		resp, err := SetRolesForUserOnCEDARSystem(ctx, okta.FetchUserInfos, cedarClient, emailClient, models.SetRolesForUserOnSystemInput{
			CedarSystemID:      cedarSystemID,
			EuaUserID:          currentUserEUA,
			DesiredRoleTypeIDs: []string{currentUserCurrentRoleID},
		})

		s.NotNil(resp)
		s.NoError(err)
		s.Len(sender.getList(), 1)
		s.Equal(sender.subject, "CEDAR Roles modified for (Adeline Aarons)")
	})

	s.Run("Should send email to CEDAR and project leads, but NOT to user if roles added to existing user", func() {
		emailClient, sender := NewEmailClient()
		resp, err := SetRolesForUserOnCEDARSystem(ctx, okta.FetchUserInfos, cedarClient, emailClient, models.SetRolesForUserOnSystemInput{
			CedarSystemID:      cedarSystemID,
			EuaUserID:          currentUserEUA,
			DesiredRoleTypeIDs: []string{currentUserCurrentRoleID, otherRoleID1, otherRoleID2},
		})

		s.NotNil(resp)
		s.NoError(err)
		s.Len(sender.getList(), 2)
		_, found := lo.Find(sender.getList(), func(e email.Email) bool {
			return e.Subject == "CEDAR Roles modified for (Adeline Aarons)"
		})
		s.True(found)

		_, found = lo.Find(sender.getList(), func(e email.Email) bool {
			return e.Subject == "Adeline Aarons has been added as a team member for Centers for Management Services"
		})
		s.True(found)
	})

	s.Run("Should send email to CEDAR, but NOT project leads or user if roles removed from existing user", func() {
		emailClient, sender := NewEmailClient()
		resp, err := SetRolesForUserOnCEDARSystem(ctx, okta.FetchUserInfos, cedarClient, emailClient, models.SetRolesForUserOnSystemInput{
			CedarSystemID:      cedarSystemID,
			EuaUserID:          currentUserEUA,
			DesiredRoleTypeIDs: []string{},
		})

		s.NotNil(resp)
		s.NoError(err)
		s.Len(sender.getList(), 1)
		_, found := lo.Find(sender.getList(), func(e email.Email) bool {
			return e.Subject == "CEDAR Roles modified for (Adeline Aarons)"
		})
		s.True(found)
	})

	s.Run("Should send email to CEDAR, project leads, and user if user is new", func() {
		emailClient, sender := NewEmailClient()
		resp, err := SetRolesForUserOnCEDARSystem(ctx, okta.FetchUserInfos, cedarClient, emailClient, models.SetRolesForUserOnSystemInput{
			CedarSystemID:      cedarSystemID,
			EuaUserID:          notCurrentUserEUA,
			DesiredRoleTypeIDs: []string{otherRoleID1, otherRoleID2},
		})

		s.NotNil(resp)
		s.NoError(err)
		s.Len(sender.getList(), 3)
		_, found := lo.Find(sender.getList(), func(e email.Email) bool {
			return e.Subject == "CEDAR Roles modified for (User One)"
		})
		s.True(found)

		_, found = lo.Find(sender.getList(), func(e email.Email) bool {
			return e.Subject == "User One has been added as a team member for Centers for Management Services"
		})
		s.True(found)

		_, found = lo.Find(sender.getList(), func(e email.Email) bool {
			return e.Subject == "You have been added as a team member for Centers for Management Services"
		})
		s.True(found)
	})

}
