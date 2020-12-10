package server

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/cedareasi"
	"github.com/cmsgov/easi-app/pkg/email"
)

// CheckCEDAREasiClientConnection makes a call to CEDAR Easi to test it is configured properly
// this method will panic on failures
func (s Server) CheckCEDAREasiClientConnection(client cedareasi.TranslatedClient) {
	s.logger.Info("Testing CEDAR EASi Connection")
	// FetchSystems is agnostic to user, doesn't modify state,
	// and tests that we're authorized to retrieve information
	// By the rubric "should someone get woken up at 2AM for this?", we have decided
	// that transitory challenges connecting to the CEDAR API should NOT block
	// deployment of the EASi app, nor should it be logged at `ERROR` level
	if _, err := client.FetchSystems(appcontext.WithLogger(context.Background(), s.logger)); err != nil {
		s.logger.Info("Non-Fatal - Failed to connect to CEDAR EASi on startup", zap.Error(err))
	}
}

// CheckEmailClient sends a email to test it is configured properly
// this method will panic on failures
func (s Server) CheckEmailClient(client email.Client) {
	s.logger.Info("Testing email client")
	err := client.SendTestEmail()
	if err != nil {
		s.logger.Fatal("Failed to send test email", zap.Error(err))
	}
}
