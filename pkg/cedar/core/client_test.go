package cedarcore

import (
	"context"
	"testing"

	"github.com/guregu/null"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

type ClientTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestClientTestSuite(t *testing.T) {
	tests := &ClientTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewExample(),
	}
	suite.Run(t, tests)
}

func (s ClientTestSuite) TestClient() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("Instantiation successful", func() {
		c := NewClient("fake", "fake", ldClient)
		s.NotNil(c)
	})

	s.Run("LD defaults protects invocation of GetSystemSummary", func() {
		c := NewClient("fake", "fake", ldClient)
		resp, err := c.GetSystemSummary(ctx)
		s.NoError(err)

		blankSummary := []*models.CedarSystem{}
		s.Equal(resp, blankSummary)
	})
	s.Run("LD defaults protects invocation of GetSystem", func() {
		c := NewClient("fake", "fake", ldClient)
		resp, err := c.GetSystem(ctx, "fake")
		s.NoError(err)

		blankSummary := models.CedarSystem{}
		s.Equal(*resp, blankSummary)
	})
	s.Run("\"person\" decodes to correct role assignee type", func() {
		enabledLdClient, err := enabledLdClient()
		s.NoError(err)
		c := NewClient("fake", "fake", enabledLdClient)

		c.sdk = newMockSdkForRoleQueries("person")

		roles, err := c.GetRolesBySystem(ctx, "fakeSystemID", null.StringFromPtr(nil))
		s.NoError(err)
		s.Equal(models.PersonAssignee, *roles[0].AssigneeType)
	})
	s.Run("\"organization\" decodes to correct role assignee type", func() {
		enabledLdClient, err := enabledLdClient()
		s.NoError(err)
		c := NewClient("fake", "fake", enabledLdClient)

		c.sdk = newMockSdkForRoleQueries("organization")

		roles, err := c.GetRolesBySystem(ctx, "fakeSystemID", null.StringFromPtr(nil))
		s.NoError(err)
		s.Equal(models.OrganizationAssignee, *roles[0].AssigneeType)
	})
	s.Run("Empty assignee type decodes to null assignee type", func() {
		enabledLdClient, err := enabledLdClient()
		s.NoError(err)
		c := NewClient("fake", "fake", enabledLdClient)

		c.sdk = newMockSdkForRoleQueries("")

		roles, err := c.GetRolesBySystem(ctx, "fakeSystemID", null.StringFromPtr(nil))
		s.NoError(err)
		s.Nil(roles[0].AssigneeType)
	})
	s.Run("Invalid value for assignee type causes role to be skipped when decoding", func() {
		enabledLdClient, err := enabledLdClient()
		s.NoError(err)
		c := NewClient("fake", "fake", enabledLdClient)

		c.sdk = newMockSdkForRoleQueries("INVALID VALUE")

		roles, err := c.GetRolesBySystem(ctx, "fakeSystemID", null.StringFromPtr(nil))
		s.NoError(err)
		blankRoles := []*models.CedarRole{}
		s.Equal(blankRoles, roles)
	})

}
