package server

import (
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/email"
)

// CheckCEDARClientConnection makes a call to CEDAR to test it is configured properly
// this method will panic on failures
func (s Server) CheckCEDARClientConnection(client cedar.TranslatedClient) {
	s.logger.Info("Testing CEDAR Connection")
	// FetchSystems is agnostic to user, doesn't modify state,
	// and tests that we're authorized to retrieve information
	_, err := client.FetchSystems(s.logger)
	if err != nil {
		s.logger.Panic("Failed to connect to CEDAR on startup", zap.Error(err))
	}
}

// CheckEmailClient sends a email to test it is configured properly
// this method will panic on failures
func (s Server) CheckEmailClient(client email.Client) {
	s.logger.Info("Testing email client")
	err := client.SendTestEmail()
	if err != nil {
		s.logger.Panic("Failed to send test email", zap.Error(err))
	}
}
