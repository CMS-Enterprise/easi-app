package context

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
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

func (s ContextTestSuite) TestWithTrace() {
	ctx := context.Background()

	ctx = WithTrace(ctx)
	traceID := ctx.Value(traceKey).(uuid.UUID)

	s.NotEqual(uuid.UUID{}, traceID)
}

func (s ContextTestSuite) TestTrace() {
	ctx := context.Background()
	expectedID := uuid.New()
	ctx = context.WithValue(ctx, traceKey, expectedID)

	traceID, ok := Trace(ctx)

	s.True(ok)
	s.NotEqual(expectedID, traceID)
}
