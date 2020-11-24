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

// NewLaunchDarklyClient returns a client backed by Launch Darkly
func NewLaunchDarklyClient(config Config) (*ld.LDClient, error) {
	ldConfig := ld.Config{Offline: config.Offline}
	return ld.MakeCustomClient(config.Key, ldConfig, config.Timeout)
}
