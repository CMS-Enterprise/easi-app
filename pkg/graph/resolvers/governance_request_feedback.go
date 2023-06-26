package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetGovernanceRequestFeedbacksByIntakeID returns all governance request feedback items for a given system intake
func GetGovernanceRequestFeedbacksByIntakeID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.GovernanceRequestFeedback, error) {
	return store.GetGovernanceRequestFeedbacksByIntakeID(ctx, id)
}
