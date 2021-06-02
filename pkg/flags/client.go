package flags

import (
	"context"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/appcontext"

	"gopkg.in/launchdarkly/go-sdk-common.v2/lduser"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
)

// Config has all the parts for creating a new LD Client
type Config struct {
	Source  appconfig.FlagSourceOption
	Key     string
	Timeout time.Duration
}

// NewLaunchDarklyClient returns a client backed by Launch Darkly
func NewLaunchDarklyClient(config Config) (*ld.LDClient, error) {
	if config.Source == appconfig.FlagSourceLaunchDarkly {
		return ld.MakeClient(config.Key, config.Timeout)
	}

	// we default to an OFFLINE client for non-deployed environments
	return ld.MakeCustomClient("fake_offline_key", ld.Config{Offline: true}, 5*time.Second)
}

// Principal builds the LaunchDarkly user object for the
// currently authenticated principal.
func Principal(ctx context.Context) lduser.User {
	p := appcontext.Principal(ctx)
	key := UserKeyForID(p.ID())

	// this is a bit of a loose inference, assuming a user w/o Job Codes
	// is an Anonymous user. Over time, may want to consider adding
	// a `func Anonymous() bool` accessor to the authorizaion.Principal interface
	// definition instead of doing this inference
	authed := (p.AllowEASi() || p.AllowGRT())

	return lduser.
		NewUserBuilder(key).
		Anonymous(!authed).
		Build()
}

// UserKeyForID generates a user key from an ID
// we should not be using bare EUA IDs as identifiers to
// LaunchDarkly (per Jimil/ISSO), so we use a cryptographically
// secure one-way hash of the EUA ID as "key" for the LD User object.
func UserKeyForID(id string) string {
	h := sha256.New()
	_, _ = h.Write([]byte(id))
	return fmt.Sprintf("%x", h.Sum(nil))
}
