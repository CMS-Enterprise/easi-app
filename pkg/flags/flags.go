package flags

import (
	"gopkg.in/launchdarkly/go-sdk-common.v2/lduser"
)

// NewFetchFlags returns all flags from LD
func NewFetchFlags() func(client FlagClient, ldUser lduser.User) FlagValues {
	return func(client FlagClient, u lduser.User) FlagValues {
		return client.Flags(u)
	}
}
