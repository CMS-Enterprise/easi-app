package appconfig

// EnvironmentKey is used to access the environment from a config
const EnvironmentKey = "ENVIRONMENT"

// Environment represents an environment
type Environment string

const (
	// LocalEnv is the local environment
	LocalEnv Environment = "local"
)

// String gets the environment as a string
func (e Environment) String() string {
	switch e {
	case LocalEnv:
		return "local"
	default:
		return ""
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
