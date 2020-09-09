package flags

import (
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"
)

// Config has all the parts for creating a new LD Client
type Config struct {
	Key     string
	Timeout time.Duration
}

// NewLDClient returns a ld client
func NewLDClient(config Config) (*ld.LDClient, error) {
	ldClient, err := ld.MakeClient(config.Key, config.Timeout)
	if err != nil {
		return nil, err
	}
	return ldClient, nil
}
