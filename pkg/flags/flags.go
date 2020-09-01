package flags

import (
	"net/http"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

func flagMiddleware(next http.Handler, key string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := ld.NewUser(key)

		ctx := appcontext.WithLDAppEnvUser(r.Context(), user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewFlagMiddleware returns a handler with the flag middleware
func NewFlagMiddleware(key string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return flagMiddleware(next, key)
	}
}

// FlagValues is the struct for our keys and values from LD
type FlagValues map[string]interface{}

// NewFetchFlags returns all flags from LD
func NewFetchFlags() func(client ld.LDClient, user ld.User) FlagValues {
	return func(c ld.LDClient, u ld.User) FlagValues {
		return allFlags(c, u)
	}

}

func allFlags(client ld.LDClient, user ld.User) FlagValues {
	currentFlags := FlagValues{}
	state := client.AllFlagsState(user)
	valuesMap := state.ToValuesMap()
	for k, v := range valuesMap {
		currentFlags[k] = v
	}
	return currentFlags
}
