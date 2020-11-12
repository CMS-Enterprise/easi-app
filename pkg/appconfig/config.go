package appconfig

import "fmt"

// NewEnvironment returns an environment from a string
func NewEnvironment(config string) (Environment, error) {
	switch config {
	case localEnv.String():
		return localEnv, nil
	case testEnv.String():
		return testEnv, nil
	case devEnv.String():
		return devEnv, nil
	case implEnv.String():
		return implEnv, nil
	case prodEnv.String():
		return prodEnv, nil
	default:
		return "", fmt.Errorf("unknown environment: %s", config)
	}
}

// EnvironmentKey is used to access the environment from a config
const EnvironmentKey = "APP_ENV"

// Environment represents an environment
type Environment string

const (
	// localEnv is the local environment
	localEnv Environment = "local"
	// testEnv is the environment for running tests
	testEnv Environment = "test"
	// devEnv is the environment for the dev deployed env
	devEnv Environment = "dev"
	// implEnv is the environment for the impl deployed env
	implEnv Environment = "impl"
	// prodEnv is the environment for the impl deployed env
	prodEnv Environment = "prod"
)

// String gets the environment as a string
func (e Environment) String() string {
	switch e {
	case localEnv:
		return "local"
	case testEnv:
		return "test"
	case devEnv:
		return "dev"
	case implEnv:
		return "impl"
	case prodEnv:
		return "prod"
	default:
		return ""
	}
}

// Local returns true if the environment is local
func (e Environment) Local() bool {
	if e == localEnv {
		return true
	}
	return false
}

// Test returns true if the environment is local
func (e Environment) Test() bool {
	if e == testEnv {
		return true
	}
	return false
}

// Dev returns true if the environment is local
func (e Environment) Dev() bool {
	if e == devEnv {
		return true
	}
	return false
}

// Impl returns true if the environment is local
func (e Environment) Impl() bool {
	if e == implEnv {
		return true
	}
	return false
}

// Prod returns true if the environment is local
func (e Environment) Prod() bool {
	if e == prodEnv {
		return true
	}
	return false
}

// Deployed returns true if in a deployed environment
func (e Environment) Deployed() bool {
	switch e {
	case devEnv:
		return true
	case implEnv:
		return true
	case prodEnv:
		return true
	default:
		return false
	}
}

// DBHostConfigKey is the Postgres hostname config key
const DBHostConfigKey = "PGHOST"

// DBPortConfigKey is the Postgres port config key
const DBPortConfigKey = "PGPORT"

// DBNameConfigKey is the Postgres database name config key
const DBNameConfigKey = "PGDATABASE"

// DBUsernameConfigKey is the Postgres username config key
const DBUsernameConfigKey = "PGUSER"

// DBPasswordConfigKey is the Postgres password config key
const DBPasswordConfigKey = "PGPASS"

// DBSSLModeConfigKey is the Postgres SSL mode config key
const DBSSLModeConfigKey = "PGSSLMODE"

// AWSSESSourceARNKey is the key for the ARN for sending email
const AWSSESSourceARNKey = "AWS_SES_SOURCE_ARN"

// AWSSESSourceKey is the key for the sender for sending email
const AWSSESSourceKey = "AWS_SES_SOURCE"

// GRTEmailKey is the key for the receiving email for the GRT
const GRTEmailKey = "GRT_EMAIL"

// ClientHostKey is the key for getting the client's domain name
const ClientHostKey = "CLIENT_HOSTNAME"

// ClientProtocolKey is the key for getting the client's protocol
const ClientProtocolKey = "CLIENT_PROTOCOL"

// EmailTemplateDirectoryKey is the key for getting the email template directory
const EmailTemplateDirectoryKey = "EMAIL_TEMPLATE_DIR"

// AWSS3FileUploadBucket is the key for the bucket we upload files to
const AWSS3FileUploadBucket = "AWS_S3_FILE_UPLOAD_BUCKET"

// AWSS3Region is the key for the region we establish a session to for file uploads
const AWSS3Region = "AWS_S3_FILE_UPLOAD_REGION"

// CEDARAPIURL is the key for the CEDAR base url
const CEDARAPIURL = "CEDAR_API_URL"

// CEDARAPIKey is the key for accessing CEDAR
const CEDARAPIKey = "CEDAR_API_KEY"

// LDKey is the key for accessing LaunchDarkly
const LDKey = "LD_SDK_KEY"

// LDTimeout is the key for accessing LaunchDarkly
const LDTimeout = "LD_TIMEOUT_SECONDS"

// FlagSourceKey indicates where flags should be loaded from
const FlagSourceKey = "FLAG_SOURCE"

// FlagSourceOption represents an environment
type FlagSourceOption string

const (
	// FlagSourceLocal is LOCAL
	FlagSourceLocal FlagSourceOption = "LOCAL"

	// FlagSourceLaunchDarkly is LAUNCH_DARKLY
	FlagSourceLaunchDarkly FlagSourceOption = "LAUNCH_DARKLY"
)
