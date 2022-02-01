package cedarcore

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/models"
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

func (s RoleTestSuite) TestDecodeAssigneeType() {
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
