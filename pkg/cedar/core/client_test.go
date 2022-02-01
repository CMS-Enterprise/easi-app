package cedarcore

import (
	"context"
	"testing"

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

func (s ClientTestSuite) TestDecodeAssigneeType() {
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

func (s ClientTestSuite) TestClient() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("Instantiation successful", func() {
		c := NewClient(ctx, "fake", "fake", ldClient)
		s.NotNil(c)
	})

	s.Run("LD defaults protects invocation of GetSystemSummary", func() {
		c := NewClient(ctx, "fake", "fake", ldClient)
		resp, err := c.GetSystemSummary(ctx, false)
		s.NoError(err)

		blankSummary := []*models.CedarSystem{}
		s.Equal(resp, blankSummary)
	})
	s.Run("LD defaults protects invocation of GetSystem", func() {
		c := NewClient(ctx, "fake", "fake", ldClient)
		resp, err := c.GetSystem(ctx, "fake")
		s.NoError(err)

		blankSummary := models.CedarSystem{}
		s.Equal(*resp, blankSummary)
	})
}
