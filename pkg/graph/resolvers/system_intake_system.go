package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
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

func CedarSystemLinkedSystemIntakes(ctx context.Context, cedarSystemID string, state models.SystemIntakeState) ([]*models.SystemIntake, error) {
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

func DeleteSystemIntakeSystemByID(ctx context.Context, store *storage.Store, systemIntakeID uuid.UUID) error {
	return sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.DeleteSystemIntakeSystemByID(ctx, tx, systemIntakeID)
	})
}

func UpdateSystemLinkByID(ctx context.Context, store *storage.Store, input models.UpdateSystemLinkInput) error {
	return sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.UpdateSystemIntakeSystemByID(ctx, tx, input)
	})
}

func GetLinkedSystemByID(ctx context.Context, store *storage.Store, systemIntakeSystemID uuid.UUID) (*models.SystemIntakeSystem, error) {
	linkedSystems, err := dataloaders.GetSystemIntakeSystemByID(ctx, systemIntakeSystemID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve cedar system ids from db", zap.Error(err))
		return nil, err
	}
	if len(linkedSystems) > 0 {
		return linkedSystems[0], nil
	}
	return nil, nil
}
