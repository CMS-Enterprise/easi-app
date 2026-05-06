package dataloaders

import (
	"context"
	"errors"
	"sync"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type cachedCedarSystemMembership struct {
	once sync.Once
	ids  map[uuid.UUID]struct{}
	err  error
}

func (d *dataReader) batchCedarSystemViewerCapabilities(ctx context.Context, cedarSystemIDs []uuid.UUID) ([]*models.CedarSystemViewerCapabilities, []error) {
	principal := appcontext.Principal(ctx)
	viewerCanAccessProfile := principal.AllowEASi()

	teamSystemIDs, err := d.getMyCedarSystemIDSet(ctx, principal.ID())
	if err != nil {
		return nil, []error{err}
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

func (d *dataReader) getMyCedarSystemIDSet(ctx context.Context, euaUserID string) (map[uuid.UUID]struct{}, error) {
	if euaUserID == "" || d.getMyCedarSystems == nil {
		return map[uuid.UUID]struct{}{}, nil
	}

	cacheEntry, _ := d.myCedarSystemsByUser.LoadOrStore(euaUserID, &cachedCedarSystemMembership{})
	cachedMembership := cacheEntry.(*cachedCedarSystemMembership)

	cachedMembership.once.Do(func() {
		mySystems, err := d.getMyCedarSystems(ctx, euaUserID)
		if err != nil {
			cachedMembership.err = err
			return
		}

		cachedMembership.ids = make(map[uuid.UUID]struct{}, len(mySystems))
		for _, system := range mySystems {
			if system != nil {
				cachedMembership.ids[system.ID] = struct{}{}
			}
		}
	})

	if cachedMembership.err != nil {
		return nil, cachedMembership.err
	}

	if cachedMembership.ids == nil {
		return map[uuid.UUID]struct{}{}, nil
	}

	return cachedMembership.ids, nil
}

func GetCedarSystemViewerCapabilities(ctx context.Context, cedarSystemID uuid.UUID) (*models.CedarSystemViewerCapabilities, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetCedarSystemViewerCapabilities")
	}

	return loaders.CedarSystemViewerCapabilities.Load(ctx, cedarSystemID)
}
