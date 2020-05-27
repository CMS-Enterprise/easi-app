package server

import (
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/cedar"
)

// CheckCEDARClientConnection makes a call to CEDAR to test it is configured properly
func (s Server) CheckCEDARClientConnection(client cedar.TranslatedClient) {
	// FetchSystems is agnostic to user, doesn't modify state,
	// and tests that we're authorized to retrieve information
	_, err := client.FetchSystems(s.logger)
	if err != nil {
		s.logger.Panic("Failed to connect to CEDAR on startup", zap.Error(err))
	}
}
