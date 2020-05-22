package handlers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

// NewBaseHandler constructs a BaseHandler
func NewBaseHandler(logger *zap.Logger) BaseHandler {
	return BaseHandler{
		logger: logger,
	}
}

// BaseHandler is a handler for shared handler functions and fields
type BaseHandler struct {
	logger *zap.Logger
}

func (h BaseHandler) responseForError(ctx context.Context, appError error, logMessage string) {
	logger, ok := appcontext.Logger(ctx)
	if !ok {
		logger = h.logger
	}
	logger.Error(logMessage, zap.Error(appError))
	return
}
