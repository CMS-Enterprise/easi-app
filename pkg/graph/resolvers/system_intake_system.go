package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/dataloaders2"
	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemIntakeSystems utilizes dataloaders to retrieve systems linked to a given system intake ID
func SystemIntakeSystems(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.CedarSystem, error) {
	siSystems, err := dataloaders2.GetSystemIntakeSystemsBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve cedar system ids from db", zap.Error(err))
		return nil, err
	}

	var systems []*models.CedarSystem
	for _, v := range siSystems {
		cedarSystemSummary, err := dataloaders2.GetCedarSystemByID(ctx, v.SystemID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("unable to retrieve system from cedar", zap.Error(err))
			continue
		}
		systems = append(systems, cedarSystemSummary)
	}
	return systems, nil
}
