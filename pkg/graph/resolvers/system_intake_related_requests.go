package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SystemIntakeRelatedIntakes utilizes dataloaders to retrieve intakes linked to other intakes through CEDAR systems or Contract Numbers
func SystemIntakeRelatedIntakes(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntake, error) {
	relatedIntakes, err := dataloaders.GetRelatedSystemIntakesBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		appcontext.ZLogger(ctx).Error("unable to retrieve related system intakes", zap.Error(err))
		return nil, err
	}

	return relatedIntakes, nil
}
