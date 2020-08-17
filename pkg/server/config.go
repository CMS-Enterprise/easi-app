package server

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appses"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/storage"
)

const configMissingMessage = "Must set config: %v"

func (s Server) checkRequiredConfig(config string) {
	if s.Config.GetString(config) == "" {
		s.logger.Fatal(fmt.Sprintf(configMissingMessage, config))
	}
}

// NewDBConfig returns a new DBConfig and check required fields
func (s Server) NewDBConfig() storage.DBConfig {
	s.checkRequiredConfig(appconfig.DBHostConfigKey)
	s.checkRequiredConfig(appconfig.DBPortConfigKey)
	s.checkRequiredConfig(appconfig.DBNameConfigKey)
	s.checkRequiredConfig(appconfig.DBUsernameConfigKey)
	if s.environment.Deployed() {
		s.checkRequiredConfig(appconfig.DBPasswordConfigKey)
	}
	s.checkRequiredConfig(appconfig.DBSSLModeConfigKey)
	return storage.DBConfig{
		Host:     s.Config.GetString(appconfig.DBHostConfigKey),
		Port:     s.Config.GetString(appconfig.DBPortConfigKey),
		Database: s.Config.GetString(appconfig.DBNameConfigKey),
		Username: s.Config.GetString(appconfig.DBUsernameConfigKey),
		Password: s.Config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:  s.Config.GetString(appconfig.DBSSLModeConfigKey),
	}
}

// NewEmailConfig returns a new email.Config and checks required fields
func (s Server) NewEmailConfig() email.Config {
	s.checkRequiredConfig(appconfig.GRTEmailKey)
	s.checkRequiredConfig(appconfig.ClientHostKey)
	s.checkRequiredConfig(appconfig.ClientProtocolKey)
	s.checkRequiredConfig(appconfig.EmailTemplateDirectoryKey)

	return email.Config{
		GRTEmail:          s.Config.GetString(appconfig.GRTEmailKey),
		URLHost:           s.Config.GetString(appconfig.ClientHostKey),
		URLScheme:         s.Config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: s.Config.GetString(appconfig.EmailTemplateDirectoryKey),
	}
}

// NewSESConfig returns a new email.Config and checks required fields
func (s Server) NewSESConfig() appses.Config {
	s.checkRequiredConfig(appconfig.AWSSESSourceARNKey)
	s.checkRequiredConfig(appconfig.AWSSESSourceKey)

	return appses.Config{
		SourceARN: s.Config.GetString(appconfig.AWSSESSourceARNKey),
		Source:    s.Config.GetString(appconfig.AWSSESSourceKey),
	}
}

// NewCEDARClientCheck checks if CEDAR clients are not connectable
func (s Server) NewCEDARClientCheck() {
	s.checkRequiredConfig(appconfig.CEDARAPIURL)
	s.checkRequiredConfig(appconfig.CEDARAPIKey)
}
