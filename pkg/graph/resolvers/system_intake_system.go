package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/models"
)

// Systems utilizies a dataloader to retrieve systems linked to a given system intake ID
func Systems(
	ctx context.Context,
	getCedarSystem func(context.Context, string) (*models.CedarSystem, error),
	systemIntakeID uuid.UUID,
) ([]*models.CedarSystem, error) {

	siSystems, err := dataloaders.GetSystemIntakeSystemsBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve cedar system ids from db")
		return nil, err
	}
	systems := []*models.CedarSystem{}
	for _, v := range siSystems {
		cedarSystemSummary, err := getCedarSystem(ctx, v.SystemID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("unable to retrieve system from cedar")
			return nil, err
		}
		systems = append(systems, cedarSystemSummary)
	}
	return systems, nil
}
