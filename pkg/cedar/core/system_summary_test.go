package cedarcore

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/local/cedarcoremock"
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
		c := NewClient(ctx, "fake", "fake", "1.0.0", time.Minute, true)
		resp, err := c.GetSystemSummary(ctx, false, nil)
		s.NoError(err)

		// ensure mock data is returned
		s.Equal(len(cedarcoremock.GetSystems()), len(resp))
		for _, v := range cedarcoremock.GetSystems() {
			s.Contains(resp, v)
		}
	})
}
func (s *SystemSummaryTestSuite) TestGetSystem() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	s.Run("LD defaults protects invocation of GetSystem", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", time.Minute, true)
		_, err := c.GetSystem(ctx, "fake")
		s.NoError(err)

		// should return mocked system when given corresponding mockKey
		for _, v := range cedarcoremock.GetSystems() {
			resp, err := c.GetSystem(ctx, v.ID.String)
			s.NoError(err)
			s.Equal(v, resp)
		}
	})
}
