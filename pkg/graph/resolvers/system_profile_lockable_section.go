package resolvers

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// OnSystemProfileLockableSectionLocksChanged is the resolver for the onSystemProfileLockableSectionLocksChanged field.
func OnSystemProfileLockableSectionLocksChanged(ctx context.Context, cedarSystemID string, typeArg models.SystemProfileLockableSection) (<-chan *models.SystemProfileSectionLockStatusChanged, error) {
	// TODO, implement this.
	/*
		We need pubsub sort of system to subscribe to changes in lock status. We need the server to spin up the graphql component on route initiation as well


	*/
	return nil, nil
}
