package server

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
)

// CheckEmailClient sends a email to test it is configured properly
// this method will panic on failures
func (s Server) CheckEmailClient(client email.Client) {
	s.logger.Info("Testing email client")
	err := client.SendTestEmail(appcontext.WithLogger(context.Background(), s.logger))
	if err != nil {
		s.logger.Fatal("Failed to send test email", zap.Error(err))
	}
}
