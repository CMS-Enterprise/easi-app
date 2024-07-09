package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SystemIntakeRelatedSystemIntakes gets related intakes by intake ID
func SystemIntakeRelatedSystemIntakes(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntake, error) {
	return dataloaders.GetRelatedSystemIntakesBySystemIntakeID(ctx, systemIntakeID)
}

// SystemIntakeRelatedTRBRequests gets related TRB Requests by intake ID
func SystemIntakeRelatedTRBRequests(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.TRBRequest, error) {
	return dataloaders.GetRelatedTRBRequestsBySystemIntakeID(ctx, systemIntakeID)
}

// TRBRequestRelatedSystemIntakes gets related System Intakes by TRB Request ID
func TRBRequestRelatedSystemIntakes(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	return dataloaders.GetRelatedSystemIntakesByTRBRequestID(ctx, trbRequestID)
}

// TRBRequestRelatedTRBRequests gets related TRB Requests by TRB Request ID
func TRBRequestRelatedTRBRequests(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequest, error) {
	return dataloaders.GetRelatedTRBRequestsByTRBRequestID(ctx, trbRequestID)
}
