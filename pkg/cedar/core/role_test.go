package cedarcore

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

type RoleTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestRoleTestSuite(t *testing.T) {
	tests := &RoleTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewExample(),
	}
	suite.Run(t, tests)
}

func (s *RoleTestSuite) TestSetRolesForUser() {
	ctx := context.Background()
	c := NewClient(ctx, "fake", "fake", "1.0.0", true, true)
	cedarSystemID := "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	s.NoError(err)
	cedarSystemName := cedarSystem.Name.String
	currentUserEUA := "ABCD"
	notCurrentUserEUA := "USR1"
	currentUserCurrentRoleName := "Business Question Contact"
	currentUserCurrentRoleID := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID02}"
	otherRoleName1 := "Survey Point of Contact"
	otherRoleID1 := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID03}"
	otherRoleName2 := "Government Task Lead (GTL)"
	otherRoleID2 := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID04}"

	s.Run("Can add roles to user", func() {
		metadata, err := c.SetRolesForUser(ctx, cedarSystemID, currentUserEUA, []string{currentUserCurrentRoleID, otherRoleID1})
		s.NoError(err)
		s.True(metadata.DidAdd)
		s.False(metadata.DidDelete)
		s.False(metadata.IsNewUser)
		s.Equal(metadata.SystemName, cedarSystemName)
		s.EqualValues(metadata.RoleTypeNamesBefore, []string{currentUserCurrentRoleName})
		s.EqualValues(metadata.RoleTypeNamesAfter, []string{currentUserCurrentRoleName, otherRoleName1})
	})
	s.Run("Can remove roles from existing user", func() {
		metadata, err := c.SetRolesForUser(ctx, cedarSystemID, currentUserEUA, []string{})
		s.NoError(err)
		s.False(metadata.DidAdd)
		s.True(metadata.DidDelete)
		s.False(metadata.IsNewUser)
		s.Equal(metadata.SystemName, cedarSystemName)
		s.EqualValues(metadata.RoleTypeNamesBefore, []string{currentUserCurrentRoleName})
		s.EqualValues(metadata.RoleTypeNamesAfter, []string{})
	})
	s.Run("Can change roles for an existing user", func() {
		metadata, err := c.SetRolesForUser(ctx, cedarSystemID, currentUserEUA, []string{otherRoleID1, otherRoleID2})
		s.NoError(err)
		s.True(metadata.DidAdd)
		s.True(metadata.DidDelete)
		s.False(metadata.IsNewUser)
		s.Equal(metadata.SystemName, cedarSystemName)
		s.EqualValues(metadata.RoleTypeNamesBefore, []string{currentUserCurrentRoleName})
		s.EqualValues(metadata.RoleTypeNamesAfter, []string{otherRoleName1, otherRoleName2})
	})
	s.Run("Can identify new user when adding roles", func() {
		metadata, err := c.SetRolesForUser(ctx, cedarSystemID, notCurrentUserEUA, []string{otherRoleID1, otherRoleID2})
		s.NoError(err)
		s.True(metadata.DidAdd)
		s.False(metadata.DidDelete)
		s.True(metadata.IsNewUser)
		s.Equal(metadata.SystemName, cedarSystemName)
		s.EqualValues(metadata.RoleTypeNamesBefore, []string{})
		s.EqualValues(metadata.RoleTypeNamesAfter, []string{otherRoleName1, otherRoleName2})
	})
	s.Run("Does not identify a user without roles as new when setting 0 roles", func() {
		metadata, err := c.SetRolesForUser(ctx, cedarSystemID, notCurrentUserEUA, []string{})
		s.NoError(err)
		s.False(metadata.DidAdd)
		s.False(metadata.DidDelete)
		s.False(metadata.IsNewUser)
		s.Equal(metadata.SystemName, cedarSystemName)
		s.EqualValues(metadata.RoleTypeNamesBefore, []string{})
		s.EqualValues(metadata.RoleTypeNamesAfter, []string{})
	})
}

func (s *RoleTestSuite) TestDecodeAssigneeType() {
	s.Run("\"person\" decodes to correct role assignee type", func() {
		assigneeType, isValid := decodeAssigneeType("person")
		s.True(isValid)
		s.Equal(models.PersonAssignee, assigneeType)
	})
	s.Run("\"organization\" decodes to correct role assignee type", func() {
		assigneeType, isValid := decodeAssigneeType("organization")
		s.True(isValid)
		s.Equal(models.OrganizationAssignee, assigneeType)
	})
	s.Run("Empty assignee type decodes to empty string", func() {
		assigneeType, isValid := decodeAssigneeType("")
		s.True(isValid)
		s.Equal(models.CedarAssigneeType(""), assigneeType)
	})
	s.Run("Invalid value for assignee type returns false for isValid", func() {
		_, isValid := decodeAssigneeType("INVALID VALUE")
		s.False(isValid)
	})
}
