package server

import (
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appses"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/flags"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/upload"
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
	s.checkRequiredConfig(appconfig.DBMaxConnections)
	s.checkRequiredConfig(appconfig.DBSSLModeConfigKey)
	s.checkRequiredConfig(appconfig.DBUsernameConfigKey)

	// Check for password if we're not using IAM authentication
	useIAM := s.environment.Deployed() // use IAM authentication in deployed environments
	if !useIAM {
		s.checkRequiredConfig(appconfig.DBPasswordConfigKey)
	}

	return storage.DBConfig{
		Host:           s.Config.GetString(appconfig.DBHostConfigKey),
		Port:           s.Config.GetString(appconfig.DBPortConfigKey),
		Database:       s.Config.GetString(appconfig.DBNameConfigKey),
		Username:       s.Config.GetString(appconfig.DBUsernameConfigKey),
		Password:       s.Config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        s.Config.GetString(appconfig.DBSSLModeConfigKey),
		UseIAM:         useIAM,
		MaxConnections: s.Config.GetInt(appconfig.DBMaxConnections),
	}
}

// NewEmailConfig returns a new email.Config and checks required fields
func (s Server) NewEmailConfig() email.Config {
	s.checkRequiredConfig(appconfig.GRTEmailKey)
	s.checkRequiredConfig(appconfig.ITInvestmentEmailKey)
	s.checkRequiredConfig(appconfig.EASIHelpEmailKey)
	s.checkRequiredConfig(appconfig.TRBEmailKey)
	s.checkRequiredConfig(appconfig.ClientHostKey)
	s.checkRequiredConfig(appconfig.ClientProtocolKey)
	s.checkRequiredConfig(appconfig.EmailTemplateDirectoryKey)
	s.checkRequiredConfig(appconfig.CEDAREmailAddress)

	return email.Config{
		GRTEmail:          models.NewEmailAddress(s.Config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail: models.NewEmailAddress(s.Config.GetString(appconfig.ITInvestmentEmailKey)),
		EASIHelpEmail:     models.NewEmailAddress(s.Config.GetString(appconfig.EASIHelpEmailKey)),
		TRBEmail:          models.NewEmailAddress(s.Config.GetString(appconfig.TRBEmailKey)),
		CEDARTeamEmail:    models.NewEmailAddress(s.Config.GetString(appconfig.CEDAREmailAddress)),
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
	s.checkRequiredConfig(appconfig.AWSRegion)

	return upload.Config{
		Bucket: s.Config.GetString(appconfig.AWSS3FileUploadBucket),
		Region: s.Config.GetString(appconfig.AWSRegion),
	}
}

// NewCEDARClientCheck checks if CEDAR clients are not connectable
func (s Server) NewCEDARClientCheck() {
	s.checkRequiredConfig(appconfig.CEDARAPIURL)
	s.checkRequiredConfig(appconfig.CEDARPROXYURL)
	s.checkRequiredConfig(appconfig.CEDARAPIKey)
	s.checkRequiredConfig(appconfig.CEDARCoreAPIVersion)
}

// NewOktaAPIClientCheck checks if the Okta API client is configured
func (s Server) NewOktaAPIClientCheck() {
	s.checkRequiredConfig(appconfig.OKTAAPIURL)
	s.checkRequiredConfig(appconfig.OKTAAPIToken)
}

// OktaClientConfig is the okta client configuration
type OktaClientConfig struct {
	AltJobCodes  bool
	OktaClientID string
	OktaIssuer   string
}

// NewOktaClientConfig returns the okta client config
func (s Server) NewOktaClientConfig() OktaClientConfig {
	s.checkRequiredConfig(appconfig.OktaClientID)
	s.checkRequiredConfig(appconfig.OktaIssuer)

	return OktaClientConfig{
		OktaClientID: s.Config.GetString(appconfig.OktaClientID),
		OktaIssuer:   s.Config.GetString(appconfig.OktaIssuer),
		AltJobCodes:  s.Config.GetBool(appconfig.AltJobCodes),
	}
}

// NewLocalAuthIsEnabled returns if local auth is enabled
func (s Server) NewLocalAuthIsEnabled() bool {
	return s.Config.GetBool(appconfig.LocalAuthEnabled)
}

// NewFlagConfig checks if Launch Darkly config exists
func (s Server) NewFlagConfig() flags.Config {
	s.checkRequiredConfig(appconfig.FlagSourceKey)

	flagSource := appconfig.FlagSourceOption(s.Config.GetString(appconfig.FlagSourceKey))

	var timeout time.Duration
	var key string
	var flagValuesFile string

	switch flagSource {
	case appconfig.FlagSourceLocal:
		timeout = 0
		key = "local-has-no-key"
	case appconfig.FlagSourceLaunchDarkly:
		s.checkRequiredConfig(appconfig.LDKey)
		s.checkRequiredConfig(appconfig.LDTimeout)
		timeout = time.Duration(s.Config.GetInt(appconfig.LDTimeout)) * time.Second
		key = s.Config.GetString(appconfig.LDKey)
	case appconfig.FlagSourceFile:
		s.checkRequiredConfig(appconfig.FlagValuesFileKey)
		flagValuesFile = s.Config.GetString(appconfig.FlagValuesFileKey)
	default:
		opts := []appconfig.FlagSourceOption{
			appconfig.FlagSourceLocal,
			appconfig.FlagSourceLaunchDarkly,
			appconfig.FlagSourceFile,
		}
		s.logger.Fatal(fmt.Sprintf("%s must be set to one of %v", appconfig.FlagSourceKey, opts))
	}

	return flags.Config{
		Source:         flagSource,
		Key:            key,
		Timeout:        timeout,
		FlagValuesFile: flagValuesFile,
	}
}
