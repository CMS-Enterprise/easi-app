package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// GetTRBFundingSourcesByRequestID retrieves funding sources for a TRB request form by TRB request ID
func GetTRBFundingSourcesByRequestID(ctx context.Context, id uuid.UUID) ([]*models.TRBFundingSource, error) {
	return dataloaders.GetTRBFundingSourcesByRequestID(ctx, id)
}

// UpdateTRBRequestFundingSources upserts funding sources for a TRB request form by TRB request ID and funding number
func UpdateTRBRequestFundingSources(
	ctx context.Context,
	store *storage.Store,
	trbRequestID uuid.UUID,
	fundingNumber string,
	sources []string,
) ([]*models.TRBFundingSource, error) {
	fundingSources := make([]*models.TRBFundingSource, len(sources))
	createdBy := appcontext.Principal(ctx).ID()
	now := time.Now()
	for i, source := range sources {
		fundingSources[i] = &models.TRBFundingSource{
			Source:        source,
			TRBRequestID:  trbRequestID,
			FundingNumber: fundingNumber,
		}
		fundingSources[i].CreatedBy = createdBy
		fundingSources[i].CreatedAt = now
		fundingSources[i].ID = uuid.New()
	}
	return store.UpdateTRBRequestFundingSources(ctx, trbRequestID, fundingNumber, fundingSources)
}

// DeleteTRBRequestFundingSources deletes funding sources for a TRB request form by TRB request ID and funding number
func DeleteTRBRequestFundingSources(
	ctx context.Context,
	store *storage.Store,
	trbRequestID uuid.UUID,
	fundingNumber string,
) ([]*models.TRBFundingSource, error) {
	return store.DeleteTRBRequestFundingSources(ctx, trbRequestID, fundingNumber)
}
