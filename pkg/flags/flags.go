package flags

import (
	ld "gopkg.in/launchdarkly/go-server-sdk.v4"
)

// NewFetchFlags returns all flags from LD
func NewFetchFlags() func(client FlagClient, ldUser ld.User) FlagValues {
	return func(client FlagClient, u ld.User) FlagValues {
		return client.Flags(u)
	}

}
