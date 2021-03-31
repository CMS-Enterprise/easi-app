package server

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

// NewGQLResponseMiddleware returns a handler with a request based logger
func NewGQLResponseMiddleware() graphql.ResponseMiddleware {
	return func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		logger := appcontext.ZLogger(ctx)
		result := next(ctx)

		requestContext := graphql.GetRequestContext(ctx)
		errorList := graphql.GetErrors(ctx)

		duration := time.Now().Sub(requestContext.Stats.OperationStart)
		complexityStats := extension.GetComplexityStats(ctx)

		errored := len(errorList) > 0
		fields := []zap.Field{
			zap.String("operation", requestContext.OperationName),
			zap.Duration("duration", duration),
			zap.Bool("error", errored),
		}

		if complexityStats != nil {
			fields = append(fields, zap.Int("complexity", complexityStats.Complexity))
		}

		if errored {
			fields = append(fields, zap.Any("errorList", errorList), zap.String("query", requestContext.RawQuery))
		}
		logger.Info("graphql query", fields...)

		return result
	}
}
