package server

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appconfig"
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
	if s.Config.GetString(appconfig.EnvironmentKey) != appconfig.LocalEnv.String() {
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
