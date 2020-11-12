package server

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appses"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/upload"
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

// NewS3Config returns a new s3.Config and checks required fields
func (s Server) NewS3Config() upload.Config {
	s.checkRequiredConfig(appconfig.AWSS3FileUploadBucket)
	s.checkRequiredConfig(appconfig.AWSS3Region)

	return upload.Config{
		Bucket: s.Config.GetString(appconfig.AWSS3FileUploadBucket),
		Region: s.Config.GetString(appconfig.AWSS3Region),
	}
}

// NewCEDARClientCheck checks if CEDAR clients are not connectable
func (s Server) NewCEDARClientCheck() {
	s.checkRequiredConfig(appconfig.CEDARAPIURL)
	s.checkRequiredConfig(appconfig.CEDARAPIKey)
}

// NewFlagConfig checks if Launch Darkly config exists
func (s Server) NewFlagConfig() flags.Config {
	s.checkRequiredConfig(appconfig.FlagSourceKey)

	flagSource := appconfig.FlagSourceOption(s.Config.GetString(appconfig.FlagSourceKey))

	var timeout time.Duration
	var key string

	switch flagSource {
	case appconfig.FlagSourceLocal:
		timeout = 0
		key = "local-has-no-key"
	case appconfig.FlagSourceLaunchDarkly:
		s.checkRequiredConfig(appconfig.LDKey)
		s.checkRequiredConfig(appconfig.LDTimeout)
		timeout = time.Duration(s.Config.GetInt(appconfig.LDTimeout)) * time.Second
		key = s.Config.GetString(appconfig.LDKey)
	default:
		opts := []appconfig.FlagSourceOption{appconfig.FlagSourceLocal, appconfig.FlagSourceLaunchDarkly}
		s.logger.Fatal(fmt.Sprintf("%s must be set to one of %v", appconfig.FlagSourceKey, opts))
	}

	return flags.Config{
		Source:  flagSource,
		Key:     key,
		Timeout: timeout,
	}
}
