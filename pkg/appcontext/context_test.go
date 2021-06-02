package appcontext

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

type ContextTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestContextTestSuite(t *testing.T) {
	contextTestSuite := &ContextTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}
	suite.Run(t, contextTestSuite)
}

func (s ContextTestSuite) TestWithLogger() {
	ctx := context.Background()
	expectedLogger := zap.NewNop()

	ctx = WithLogger(ctx, expectedLogger)
	logger := ctx.Value(loggerKey).(*zap.Logger)

	s.Equal(expectedLogger, logger)
}

func (s ContextTestSuite) TestLogger() {
	ctx := context.Background()
	expectedLogger := zap.NewNop()
	ctx = context.WithValue(ctx, loggerKey, expectedLogger)

	logger, ok := Logger(ctx)

	s.True(ok)
	s.Equal(expectedLogger, logger)
}

func TestZLogger(t *testing.T) {
	// functional logger returned even when not set
	fallback := ZLogger(context.Background())
	fallback.Info("silently succeeds") // not nil

	// Also ensure it retrieves a set logger
	expectedLogger := zap.NewExample()
	ctx := WithLogger(context.Background(), expectedLogger)
	logger := ZLogger(ctx)
	assert.Equal(t, expectedLogger, logger)
}

func (s ContextTestSuite) TestWithTrace() {
	ctx, tID := WithTrace(context.Background())
	traceID := ctx.Value(traceKey).(uuid.UUID)

	s.NotEqual(uuid.UUID{}, traceID)
	s.Equal(tID, traceID)
}

func (s ContextTestSuite) TestTrace() {
	ctx := context.Background()
	expectedID := uuid.New()
	ctx = context.WithValue(ctx, traceKey, expectedID)

	traceID, ok := Trace(ctx)

	s.True(ok)
	s.Equal(expectedID, traceID)
}

func TestContextPrincipal(t *testing.T) {
	// Arrange (of AAA)
	submitterID := "submitter"
	reviewerID := "reviewer"

	testCases := map[string]struct {
		ctx        context.Context
		expectID   string
		expectEASi bool
		expectGRT  bool
	}{
		"unassigned returns anonymous": {
			ctx:        context.Background(),
			expectID:   "ANON",
			expectEASi: false,
			expectGRT:  false,
		},
		"regular user": {
			ctx: WithPrincipal(context.Background(), &authentication.EUAPrincipal{
				EUAID:       submitterID,
				JobCodeEASi: true,
				JobCodeGRT:  false,
			}),
			expectID:   submitterID,
			expectEASi: true,
			expectGRT:  false,
		},
		"GRT reviewer": {
			ctx: WithPrincipal(context.Background(), &authentication.EUAPrincipal{
				EUAID:       reviewerID,
				JobCodeEASi: true,
				JobCodeGRT:  true,
			}),
			expectID:   reviewerID,
			expectEASi: true,
			expectGRT:  true,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			// Act (of AAA)
			p := Principal(tc.ctx)

			// Assert (of AAA)
			assert.Equal(t, tc.expectID, p.ID(), "ID")
			assert.Equal(t, tc.expectEASi, p.AllowEASi(), "EASi")
			assert.Equal(t, tc.expectGRT, p.AllowGRT(), "GRT")
		})
	}
}
