package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TRBRequestSystems utilizes dataloaders to retrieve systems linked to a given trb request ID
func TRBRequestSystems(ctx context.Context, trbRequestID uuid.UUID) ([]*models.CedarSystem, error) {
	trbRequests, err := dataloaders.GetTRBRequestSystemsByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve cedar system ids from db", zap.Error(err))
		return nil, err
	}

	var systems []*models.CedarSystem
	for _, v := range trbRequests {
		cedarSystemSummary, err := dataloaders.GetCedarSystemByID(ctx, v.SystemID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("unable to retrieve system from cedar", zap.Error(err))
			continue
		}
		systems = append(systems, cedarSystemSummary)
	}
	return systems, nil
}

func CedarSystemLinkedTRBRequests(ctx context.Context, cedarSystemID string, state models.TRBRequestState) ([]*models.TRBRequest, error) {
	return dataloaders.GetCedarSystemLinkedTRBRequests(ctx, cedarSystemID, state)
}
