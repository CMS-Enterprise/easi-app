package server

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
)

// NewGQLResponseMiddleware returns a handler with a request based logger
func NewGQLResponseMiddleware() graphql.ResponseMiddleware {
	return func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		logger := appcontext.ZLogger(ctx)
		result := next(ctx)

		requestContext := graphql.GetOperationContext(ctx)
		errorList := graphql.GetErrors(ctx)

		duration := time.Since(requestContext.Stats.OperationStart)
		complexityStats := extension.GetComplexityStats(ctx)

		// Flag the request as an error if there are any errors in the list that aren't ignored
		numTotalErrors := len(errorList)
		numIgnoredErrors := countIgnoredErrors(errorList)
		errored := (numTotalErrors > 0) && (numTotalErrors != numIgnoredErrors)
		fields := []zap.Field{
			zap.String("operation", requestContext.OperationName),
			zap.Duration("duration", duration),
			zap.Bool("error", errored),
		}

		if complexityStats != nil {
			fields = append(fields, zap.Int("complexity", complexityStats.Complexity))
		}

		if numTotalErrors > 0 {
			fields = append(fields, zap.Any("errorList", errorList), zap.String("query", requestContext.RawQuery))
		}
		logger.Info("graphql query", fields...)

		return result
	}
}

func countIgnoredErrors(errorList gqlerror.List) int {
	numIgnored := 0
	for _, err := range errorList {
		if err != nil {
			// Ignore errors of type apperrors.UnauthorizedError
			if _, ok := err.Unwrap().(*apperrors.UnauthorizedError); ok {
				numIgnored++
			}
		}
	}
	return numIgnored
}
