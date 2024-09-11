package server

import (
	"context"
	"errors"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
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

		numTotalErrors := len(errorList)
		numIgnoredErrors := countIgnoredErrors(errorList)
		errored := (numTotalErrors > 0) && (numTotalErrors != numIgnoredErrors) // Flag the request as an error if there are any errors in the list that aren't ignored
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
			// Ignore any errors that wrap an apperrors.UnauthorizedError somewhere in their chain
			var unauthorizedError *apperrors.UnauthorizedError
			if errors.As(err, &unauthorizedError) {
				numIgnored++
			}

			// Ignore context.Canceled errors
			// context.Canceled is a value, not a type, so use errors.Is() instead of errors.As()
			if errors.Is(err, context.Canceled) {
				numIgnored++
			}
		}
	}
	return numIgnored
}
