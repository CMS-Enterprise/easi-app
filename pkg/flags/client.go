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
	Offline bool
}

// FlagValues is the struct for our keys and values from LD
type FlagValues map[string]interface{}

// FlagClient provides a way to retrieve the set of flags
type FlagClient interface {
	Flags(user ld.User) FlagValues
}

// LaunchDarklyClient is backed by the LaunchDarkly service
// (network access is not needed in Offline Mode)
type LaunchDarklyClient struct {
	client *ld.LDClient
}

// Flags returns the flags from Launch Darkly
func (c *LaunchDarklyClient) Flags(user ld.User) FlagValues {
	currentFlags := FlagValues{}
	valuesMap := c.client.AllFlagsState(user, ld.ClientSideOnly).ToValuesMap()
	for k, v := range valuesMap {
		currentFlags[k] = v
	}
	return currentFlags
}

// NewLaunchDarklyClient returns a client backed by Launch Darkly
func NewLaunchDarklyClient(config Config) (*LaunchDarklyClient, error) {
	ldConfig := ld.Config{Offline: config.Offline}
	ldClient, err := ld.MakeCustomClient(config.Key, ldConfig, config.Timeout)
	if err != nil {
		return nil, err
	}
	return &LaunchDarklyClient{client: ldClient}, nil
}
