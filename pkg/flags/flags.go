package flags

import (
	ld "gopkg.in/launchdarkly/go-server-sdk.v4"
)

// FlagValues is the struct for our keys and values from LD
type FlagValues map[string]interface{}

// NewFetchFlags returns all flags from LD
func NewFetchFlags() func(client ld.LDClient, ldUser ld.User) FlagValues {
	return func(c ld.LDClient, u ld.User) FlagValues {
		return allFlags(c, u)
	}

}

func allFlags(client ld.LDClient, user ld.User) FlagValues {
	currentFlags := FlagValues{}
	state := client.AllFlagsState(user, ld.ClientSideOnly)
	valuesMap := state.ToValuesMap()
	for k, v := range valuesMap {
		currentFlags[k] = v
	}
	return currentFlags
}
