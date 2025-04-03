package scheduler

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

type contextKey int

const (
	storeKey contextKey = iota
	buildDataLoadersKey
	emailClientKey
)

// CreateSchedulerContext creates a context with the given logger, store, and buildDataLoaders
func CreateSchedulerContext(ctx context.Context, logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders, emailClient *email.Client) context.Context {
	decoratedLogger := logger.With(logfields.SchedulerAppSection)
	ctx = appcontext.WithLogger(ctx, decoratedLogger)
	ctx = ContextWithStore(ctx, store)
	ctx = ContextWithBuildDataLoaders(ctx, buildDataLoaders)
	ctx = ContextWithEmailClient(ctx, emailClient)

	return ctx
}

// ContextWithStore returns a context with the given store
func ContextWithStore(ctx context.Context, store *storage.Store) context.Context {
	return context.WithValue(ctx, storeKey, store)
}

// Store returns the context's store
func Store(ctx context.Context) *storage.Store {
	if store, ok := ctx.Value(storeKey).(*storage.Store); ok {
		return store
	}
	return nil
}

// ContextWithBuildDataLoaders returns a context with the given buildDataLoaders
func ContextWithBuildDataLoaders(ctx context.Context, buildDataLoaders dataloaders.BuildDataloaders) context.Context {
	return context.WithValue(ctx, buildDataLoadersKey, buildDataLoaders)
}

// BuildDataloaders returns the context's buildDataLoaders
func BuildDataloaders(ctx context.Context) dataloaders.BuildDataloaders {
	if buildDataLoaders, ok := ctx.Value(buildDataLoadersKey).(dataloaders.BuildDataloaders); ok {
		return buildDataLoaders
	}
	return nil
}

// ContextWithEmailClient returns a context with the given emailClient
func ContextWithEmailClient(ctx context.Context, emailClient *email.Client) context.Context {
	return context.WithValue(ctx, emailClientKey, emailClient)
}

// EmailClient returns the context's emailClient
func EmailClient(ctx context.Context) *email.Client {
	if emailClient, ok := ctx.Value(emailClientKey).(*email.Client); ok {
		return emailClient
	}
	return nil
}
