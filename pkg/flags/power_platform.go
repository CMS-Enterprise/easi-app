package flags

import (
	"context"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

const key = "enablePowerPlatform"

func PowerPlatformEnabled(ctx context.Context, client *ld.LDClient) (bool, error) {
	return client.BoolVariation(key, Principal(ctx), false)
}
