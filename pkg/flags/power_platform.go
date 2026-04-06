package flags

import (
	"context"
	"errors"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

const key = "enablePowerPlatform"
const PowerPlatformSystemIntakeEditingDeniedMessage = "system intake editing from directly within EASi is not permitted to Power Platform enabled users"

var ErrPowerPlatformSystemIntakeEditingDenied = errors.New(PowerPlatformSystemIntakeEditingDeniedMessage)

func powerPlatformEnabled(ctx context.Context, client *ld.LDClient) (bool, error) {
	return client.BoolVariation(key, Principal(ctx), false)
}

func GuardSystemIntakeEditing(ctx context.Context, client *ld.LDClient) error {
	enabled, err := powerPlatformEnabled(ctx, client)
	if err != nil {
		return err
	}

	if enabled {
		return ErrPowerPlatformSystemIntakeEditingDenied
	}

	return nil
}
