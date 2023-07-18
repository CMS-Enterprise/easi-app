package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// ProgressIntakeToNewStep handles a Progress to New Step action on an intake
func ProgressIntakeToNewStep(ctx context.Context, store *storage.Store, input *model.SystemIntakeProgressToNewStepsInput) (*models.SystemIntake, error) {
	panic("not yet implemented")
}
