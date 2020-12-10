package flags

import (
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/appconfig"
)

// Config has all the parts for creating a new LD Client
type Config struct {
	Source  appconfig.FlagSourceOption
	Key     string
	Timeout time.Duration
}

// FlagValues is the struct for our keys and values from LD
type FlagValues map[string]interface{}

// FlagClient provides a way to retrieve the set of flags
type FlagClient interface {
	Flags(user ld.User) FlagValues
}

// LaunchDarklyClient is backed by the LaunchDarkly service and requires
// network access.
type LaunchDarklyClient struct {
	client *ld.LDClient
}

// Flags returns the flags from Launch Darkly
func (c LaunchDarklyClient) Flags(user ld.User) FlagValues {
	currentFlags := FlagValues{}
	state := c.client.AllFlagsState(user, ld.ClientSideOnly)
	valuesMap := state.ToValuesMap()
	for k, v := range valuesMap {
		currentFlags[k] = v
	}
	return currentFlags
}

// LocalFlagClient returns a set of flags specified locally
type LocalFlagClient struct {
	flags FlagValues
}

// Flags returns all flags
func (c LocalFlagClient) Flags(user ld.User) FlagValues {
	return c.flags
}

// NewLaunchDarklyClient returns a client backed by Launch Darkly
func NewLaunchDarklyClient(config Config) (*ld.LDClient, error) {
	return ld.MakeClient(config.Key, config.Timeout)
}

// WrapLaunchDarklyClient returns a client that fulfils the flags.FlagClient interface
func WrapLaunchDarklyClient(c *ld.LDClient) *LaunchDarklyClient {
	return &LaunchDarklyClient{client: c}
}

// NewLocalClient returns a client backed by local values
func NewLocalClient(flags FlagValues) *LocalFlagClient {
	return &LocalFlagClient{flags: flags}
}
