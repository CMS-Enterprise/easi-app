package cedarcore

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
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

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("LD defaults protects invocation of GetSystemSummary", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", time.Minute, ldClient)
		resp, err := c.GetSystemSummary(ctx, false)
		s.NoError(err)

		// ensure mock data is returned
		s.Equal(len(mockSystems), len(resp))
		for _, v := range mockSystems {
			s.Contains(resp, v)
		}
	})
}
func (s *SystemSummaryTestSuite) TestGetSystem() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("LD defaults protects invocation of GetSystem", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", time.Minute, ldClient)
		// fake, non-mocked systemID should not return system
		resp, err := c.GetSystem(ctx, "fake")
		s.NoError(err)
		s.Empty(resp)

		// should return mocked system when given corresponding mockKey
		for k, v := range mockSystems {
			resp, err = c.GetSystem(ctx, k)
			s.NoError(err)
			s.Equal(v, resp)
		}
	})
}
