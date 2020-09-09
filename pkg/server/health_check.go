package server

import (
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/cedar/cedareasi"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap"
	"github.com/cmsgov/easi-app/pkg/email"
)

// CheckCEDAREasiClientConnection makes a call to CEDAR Easi to test it is configured properly
// this method will panic on failures
func (s Server) CheckCEDAREasiClientConnection(client cedareasi.TranslatedClient) {
	s.logger.Info("Testing CEDAR EASi Connection")
	// FetchSystems is agnostic to user, doesn't modify state,
	// and tests that we're authorized to retrieve information
	_, err := client.FetchSystems(s.logger)
	if err != nil {
		s.logger.Error("Failed to connect to CEDAR EASi on startup", zap.Error(err))
	}
}

// CheckCEDARLdapClientConnection makes a call to CEDAR LDAP to test it is configured properly
// this method will panic on failures
func (s Server) CheckCEDARLdapClientConnection(client cedarldap.TranslatedClient) {
	//s.logger.Info("Testing CEDAR LDAP Connection")
	// Authenticate is agnostic to user, doesn't modify state,
	// and tests that we're authorized to retrieve information
	//TODO standardize this in some way that doesn't use a specific EUAID
	//_, err := client.FetchUserEmailAddress(s.logger, "ABCD")
	//if err != nil {
	//	s.logger.Fatal("Failed to connect to CEDAR LDAP on startup", zap.Error(err))
	//}
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
