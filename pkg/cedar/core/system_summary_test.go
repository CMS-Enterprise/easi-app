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

type SystemSummaryTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestSystemSummaryTestSuite(t *testing.T) {
	tests := &SystemSummaryTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewExample(),
	}
	suite.Run(t, tests)
}

func (s SystemSummaryTestSuite) TestGetSystemSummary() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("LD defaults protects invocation of GetSystemSummary", func() {
		c := NewClient(ctx, "fake", "fake", ldClient)
		resp, err := c.GetSystemSummary(ctx, false)
		s.NoError(err)

		blankSummary := []*models.CedarSystem{}
		s.Equal(resp, blankSummary)
	})
}
func (s SystemSummaryTestSuite) TestGetSystem() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("LD defaults protects invocation of GetSystem", func() {
		c := NewClient(ctx, "fake", "fake", ldClient)
		resp, err := c.GetSystem(ctx, "fake")
		s.NoError(err)

		blankSummary := models.CedarSystem{}
		s.Equal(*resp, blankSummary)
	})
}
