package cedarcore

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
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

func (s *SystemSummaryTestSuite) TestGetSystemSummary() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	s.Run("LD defaults protects invocation of GetSystemSummary", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", false, true)
		resp, err := c.GetSystemSummary(ctx)
		s.NoError(err)

		// ensure mock data is returned
		s.Equal(len(cedarcoremock.GetActiveSystems()), len(resp))
		for _, v := range cedarcoremock.GetActiveSystems() {
			s.Contains(resp, v)
		}
	})

	s.Run("Retrieves filtered list when EUA filter is present", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", false, true)
		resp, err := c.GetSystemSummary(ctx, SystemSummaryOpts.WithEuaIDFilter("USR1"))
		s.NoError(err)

		// ensure filtered mock data is returned
		s.Equal(len(cedarcoremock.GetFilteredSystems()), len(resp))
		for _, v := range cedarcoremock.GetFilteredSystems() {
			s.Contains(resp, v)
		}
	})

	s.Run("Retrieves filtered list when Sub-System filter is present", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", false, true)
		resp, err := c.GetSystemSummary(ctx, SystemSummaryOpts.WithSubSystems("1"))
		s.NoError(err)

		// ensure filtered mock data is returned
		s.Equal(len(cedarcoremock.GetFilteredSystems()), len(resp))
		for _, v := range cedarcoremock.GetFilteredSystems() {
			s.Contains(resp, v)
		}
	})
}

func (s *SystemSummaryTestSuite) TestGetSystem() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	s.Run("LD defaults protects invocation of GetSystem", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", false, true)
		_, err := c.GetSystem(ctx, "fake")
		s.NoError(err)

		// should return mocked system when given corresponding mockKey, including inactive/deactivated systems
		for _, v := range cedarcoremock.GetAllSystems() {
			resp, err := c.GetSystem(ctx, v.ID.String)
			s.NoError(err)
			s.Equal(v, resp)
		}
	})
}
