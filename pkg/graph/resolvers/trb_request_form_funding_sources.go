package resolvers

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/google/uuid"
)

// GetTRBRequestFormByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetFundingSourcesByRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.TRBFundingSource, error) {
	return store.GetFundingSourcesByRequestID(ctx, id)
}

func UpdateTRBRequestFundingSources(
	ctx context.Context,
	store *storage.Store,
	trbRequestId uuid.UUID,
	fundingNumber string,
	sources []string,
) ([]*models.TRBFundingSource, error) {
	fundingSources := make([]*models.TRBFundingSource, len(sources))
	createdBy := appcontext.Principal(ctx).ID()
	now := time.Now()
	for i, source := range sources {
		fundingSources[i] = &models.TRBFundingSource{
			Source:        source,
			TRBRequestID:  trbRequestId,
			FundingNumber: fundingNumber,
		}
		fundingSources[i].CreatedBy = createdBy
		fundingSources[i].CreatedAt = now
		fundingSources[i].ID = uuid.New()
	}
	return store.UpdateTRBRequestFundingSources(ctx, trbRequestId, fundingNumber, fundingSources)
}

func DeleteTRBRequestFundingSources(
	ctx context.Context,
	store *storage.Store,
	trbRequestId uuid.UUID,
	fundingNumber string,
) ([]*models.TRBFundingSource, error) {
	return store.DeleteTRBRequestFundingSources(ctx, trbRequestId, fundingNumber)
}
