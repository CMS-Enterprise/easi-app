package handlers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

// NewHandlerBase constructs a HandlerBase
func NewHandlerBase(logger *zap.Logger) HandlerBase {
	return HandlerBase{
		logger: logger,
	}
}

// HandlerBase is a type for shared handler functions and fields
type HandlerBase struct {
	logger *zap.Logger
}

func (b HandlerBase) writeErrorResponse(ctx context.Context, appError error, logMessage string) {
	logger, ok := appcontext.Logger(ctx)
	if !ok {
		logger = b.logger
	}
	logger.Error(logMessage, zap.Error(appError))
	return
}
