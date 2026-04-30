package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// SystemIntakeSystems utilizes dataloaders to retrieve systems linked to a given system intake ID
func SystemIntakeSystems(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.CedarSystem, error) {
	siSystems, err := dataloaders.GetSystemIntakeSystemsBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve cedar system ids from db", zap.Error(err))
		return nil, err
	}

	var systems []*models.CedarSystem
	for _, v := range siSystems {
		cedarSystemSummary, err := dataloaders.GetCedarSystemByID(ctx, v.SystemID)
		if err != nil {
			appcontext.ZLogger(ctx).Error("unable to retrieve system from cedar", zap.Error(err))
			continue
		}
		systems = append(systems, cedarSystemSummary)
	}
	return systems, nil
}

func CedarSystemLinkedSystemIntakes(ctx context.Context, cedarSystemID uuid.UUID, state models.SystemIntakeState) ([]*models.SystemIntake, error) {
	return dataloaders.GetCedarSystemLinkedSystemIntakes(ctx, cedarSystemID, state)
}

// SystemIntakeSystemsByIntakeID utilizes dataloaders to retrieve systems linked to a given system intake ID
func SystemIntakeSystemsByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeSystem, error) {
	systems, err := dataloaders.GetSystemIntakeSystemsBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve cedar system ids from db", zap.Error(err))
		return nil, err
	}
	return systems, nil
}

func AddSystemLink(ctx context.Context, store *storage.Store, input models.AddSystemLinkInput) (*models.AddSystemLinkPayload, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if err := authorizeUserCanManageSystemIntakeRelations(ctx, intake); err != nil {
		return nil, err
	}

	userID := appcontext.Principal(ctx).Account().ID

	systemLink := models.SystemIntakeSystem{
		BaseStructUser:                     models.NewBaseStructUser(userID),
		SystemIntakeID:                     input.SystemIntakeID,
		SystemID:                           input.SystemID,
		SystemRelationshipType:             input.SystemRelationshipType,
		OtherSystemRelationshipDescription: input.OtherSystemRelationshipDescription,
	}

	newSystemLink, err := store.AddSystemIntakeSystem(ctx, systemLink)

	if err != nil {
		return nil, err
	}

	return &models.AddSystemLinkPayload{
		ID:                                 newSystemLink.ID,
		SystemIntakeID:                     newSystemLink.SystemIntakeID,
		SystemID:                           newSystemLink.SystemID,
		SystemRelationshipType:             newSystemLink.SystemRelationshipType,
		OtherSystemRelationshipDescription: newSystemLink.OtherSystemRelationshipDescription,
	}, nil
}

func DeleteSystemIntakeSystemByID(ctx context.Context, store *storage.Store, systemIntakeID uuid.UUID) (models.SystemIntakeSystem, error) {
	linkedSystem, err := store.GetLinkedSystemByID(ctx, systemIntakeID)
	if err != nil {
		return models.SystemIntakeSystem{}, err
	}

	intake, err := store.FetchSystemIntakeByID(ctx, linkedSystem.SystemIntakeID)
	if err != nil {
		return models.SystemIntakeSystem{}, err
	}

	if err := authorizeUserCanManageSystemIntakeRelations(ctx, intake); err != nil {
		return models.SystemIntakeSystem{}, err
	}

	return store.DeleteSystemIntakeSystemByID(ctx, systemIntakeID)
}

func UpdateSystemLinkByID(ctx context.Context, store *storage.Store, input models.UpdateSystemLinkInput) (models.SystemIntakeSystem, error) {
	linkedSystem, err := store.GetLinkedSystemByID(ctx, input.ID)
	if err != nil {
		return models.SystemIntakeSystem{}, err
	}

	intake, err := store.FetchSystemIntakeByID(ctx, linkedSystem.SystemIntakeID)
	if err != nil {
		return models.SystemIntakeSystem{}, err
	}

	if err := authorizeUserCanManageSystemIntakeRelations(ctx, intake); err != nil {
		return models.SystemIntakeSystem{}, err
	}

	updatedSystem, err := store.UpdateSystemIntakeSystemByID(ctx, input)

	if err != nil {
		return models.SystemIntakeSystem{}, err
	}

	return updatedSystem, nil
}

func GetLinkedSystemByID(ctx context.Context, store *storage.Store, systemIntakeSystemID uuid.UUID) (*models.SystemIntakeSystem, error) {
	return store.GetLinkedSystemByID(ctx, systemIntakeSystemID)
}

func GetSystemIntakeSystem(ctx context.Context, store *storage.Store, systemIntakeSystemID uuid.UUID) (*models.SystemIntakeSystem, error) {
	linkedSystem, err := GetLinkedSystemByID(ctx, store, systemIntakeSystemID)
	if err != nil {
		return nil, err
	}
	if linkedSystem == nil {
		return nil, nil
	}

	intake, err := store.FetchSystemIntakeByID(ctx, linkedSystem.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if err := authorizeUserCanManageSystemIntakeRelations(ctx, intake); err != nil {
		return nil, err
	}

	return linkedSystem, nil
}

func GetSystemIntakeSystems(ctx context.Context, store *storage.Store, systemIntakeID uuid.UUID) ([]*models.SystemIntakeSystem, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	if err := authorizeUserCanManageSystemIntakeRelations(ctx, intake); err != nil {
		return nil, err
	}

	return SystemIntakeSystemsByIntakeID(ctx, systemIntakeID)
}
