package scheduler

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
)

// CreateSchedulerContext creates a context with the given logger, store, and buildDataLoaders
func CreateSchedulerContext(ctx context.Context, logger *zap.Logger) context.Context {
	decoratedLogger := logger.With(logfields.SchedulerAppSection)
	ctx = appcontext.WithLogger(ctx, decoratedLogger)
	return ctx
}
