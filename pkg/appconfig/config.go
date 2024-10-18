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
	return e == localEnv
}

// Test returns true if the environment is local
func (e Environment) Test() bool {
	return e == testEnv
}

// Dev returns true if the environment is local
func (e Environment) Dev() bool {
	return e == devEnv
}

// Impl returns true if the environment is local
func (e Environment) Impl() bool {
	return e == implEnv
}

// Prod returns true if the environment is local
func (e Environment) Prod() bool {
	return e == prodEnv
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
	case localEnv, testEnv:
		return false
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

// DBMaxConnections is the maximum number of connections to the database
const DBMaxConnections = "DB_MAX_CONNECTIONS"

// AWSSESSourceARNKey is the key for the ARN for sending email
const AWSSESSourceARNKey = "AWS_SES_SOURCE_ARN"

// AWSSESSourceKey is the key for the sender for sending email
const AWSSESSourceKey = "AWS_SES_SOURCE"

// GRTEmailKey is the key for the receiving email for the GRT
const GRTEmailKey = "GRT_EMAIL"

// ITInvestmentEmailKey is the key for the receiving email for IT investment
const ITInvestmentEmailKey = "IT_INVESTMENT_EMAIL"

// EASIHelpEmailKey is the key for the receiving email for EASI help requests
const EASIHelpEmailKey = "EASI_HELP_EMAIL"

// TRBEmailKey is the key for the receiving email to the TRB email
const TRBEmailKey = "TRB_EMAIL"

// OITFeedbackChannelSlackLink is the key for the OIT feedback slack channel
const OITFeedbackChannelSlackLink = "OIT_FEEDBACK_CHANNEL_SLACK_LINK"

// ClientHostKey is the key for getting the client's domain name
const ClientHostKey = "CLIENT_HOSTNAME"

// ClientProtocolKey is the key for getting the client's protocol
const ClientProtocolKey = "CLIENT_PROTOCOL"

// EmailTemplateDirectoryKey is the key for getting the email template directory
const EmailTemplateDirectoryKey = "EMAIL_TEMPLATE_DIR"

// AWSS3FileUploadBucket is the key for the bucket we upload files to
const AWSS3FileUploadBucket = "AWS_S3_FILE_UPLOAD_BUCKET"

// LocalMinioAddressKey is the host used for local minio
const LocalMinioAddressKey = "MINIO_ADDRESS"

// LocalMinioS3AccessKey is a key used for local access to minio
const LocalMinioS3AccessKey = "MINIO_ACCESS_KEY"

// LocalMinioS3SecretKey is the secret key used for local access to minio
const LocalMinioS3SecretKey = "MINIO_SECRET_KEY"

// AWSRegion is the key for the region we establish a session to for AWS services
const AWSRegion = "AWS_REGION"

// CEDARPROXYURL is the key for the CEDAR proxy url
const CEDARPROXYURL = "CEDAR_PROXY_URL"

// CEDARAPIURL is the key for the CEDAR base url
const CEDARAPIURL = "CEDAR_API_URL"

// CEDARAPIKey is the key for accessing CEDAR
const CEDARAPIKey = "CEDAR_API_KEY" // #nosec

// CEDARCoreSkipProxy is the key for whether to make calls directly to CEDAR Core
const CEDARCoreSkipProxy = "CEDAR_CORE_SKIP_PROXY"

// CEDAREmailAddress is the key for the env var that holds the email address that we use when notifying CEDAR of changes
const CEDAREmailAddress = "CEDAR_EMAIL_ADDRESS"

// CEDARCoreAPIVersion is the version of the CEDAR core API to use
const CEDARCoreAPIVersion = "CEDAR_CORE_API_VERSION"

// CEDARCoreMock is the key for the environment variable that determines if the CEDAR Core API should be mocked
// If set to true, mock data will be used
// If set to false, real calls to the CEDAR Core API will be made
const CEDARCoreMock = "CEDAR_CORE_MOCK"

// CEDARIntakeEnabled is the key for the environment variable that determines if the CEDAR Intake API should enabled
// If set to true, real calls to the CEDAR Intake API will be made
// If set to false, the Intake API Client methods will do nothing
const CEDARIntakeEnabled = "CEDAR_INTAKE_ENABLED"

// LDKey is the key for accessing LaunchDarkly
const LDKey = "LD_SDK_KEY"

// LDTimeout is the key for accessing LaunchDarkly
const LDTimeout = "LD_TIMEOUT_SECONDS"

// FlagSourceKey indicates where flags should be loaded from
const FlagSourceKey = "FLAG_SOURCE"

// FlagValuesFileKey is the key for the environment variable with the file path to a LaunchDarkly flag values file
const FlagValuesFileKey = "FLAGDATA_FILE"

// LocalAuthEnabled is whether local auth should be enabled
const LocalAuthEnabled = "LOCAL_AUTH_ENABLED"

// OktaClientID is the okta client id
const OktaClientID = "OKTA_CLIENT_ID"

// OktaIssuer is the okta issuer
const OktaIssuer = "OKTA_ISSUER"

// AltJobCodes are alternate job codes
const AltJobCodes = "ALT_JOB_CODES"

// FlagSourceOption represents an environment
type FlagSourceOption string

const (
	// FlagSourceLocal is LOCAL
	FlagSourceLocal FlagSourceOption = "LOCAL"

	// FlagSourceFile is FILE (for setting LaunchDarkly flag values in a file for use when testing)
	FlagSourceFile FlagSourceOption = "FILE"

	// FlagSourceLaunchDarkly is LAUNCH_DARKLY
	FlagSourceLaunchDarkly FlagSourceOption = "LAUNCH_DARKLY"
)

// OKTAAPIURL is the key for the Okta API url
const OKTAAPIURL = "OKTA_API_URL"

// OKTAAPIToken is the key for the Okta API token
// #nosec G101 false positive - not the actual API key itself
const OKTAAPIToken = "OKTA_API_TOKEN"

// OktaLocalEnabled is the key for enabling OKTA on local dev
const OktaLocalEnabled = "USE_OKTA_LOCAL"
