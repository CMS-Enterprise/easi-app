package handlers

import (
	"context"
	"io"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
)

func closeRequestBody(ctx context.Context, body io.Closer) {
	if body == nil {
		return
	}

	if err := body.Close(); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to close request body", zap.Error(err))
	}
}
