package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchCedarSystemViewerCapabilities(ctx context.Context, cedarSystemIDs []uuid.UUID) ([]*models.CedarSystemViewerCapabilities, []error) {
	principal := appcontext.Principal(ctx)
	viewerCanAccessProfile := principal.AllowEASi()

	teamSystemIDs := map[uuid.UUID]struct{}{}

	if principal.ID() != "" && d.getMyCedarSystems != nil {
		mySystems, err := d.getMyCedarSystems(ctx, principal.ID())
		if err != nil {
			return nil, []error{err}
		}

		for _, system := range mySystems {
			if system != nil {
				teamSystemIDs[system.ID] = struct{}{}
			}
		}
	}

	out := make([]*models.CedarSystemViewerCapabilities, len(cedarSystemIDs))
	for i, cedarSystemID := range cedarSystemIDs {
		_, viewerCanAccessWorkspace := teamSystemIDs[cedarSystemID]
		out[i] = &models.CedarSystemViewerCapabilities{
			ViewerCanAccessProfile:   viewerCanAccessProfile,
			ViewerCanAccessWorkspace: viewerCanAccessWorkspace,
		}
	}

	return out, nil
}

func GetCedarSystemViewerCapabilities(ctx context.Context, cedarSystemID uuid.UUID) (*models.CedarSystemViewerCapabilities, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetCedarSystemViewerCapabilities")
	}

	return loaders.CedarSystemViewerCapabilities.Load(ctx, cedarSystemID)
}
