package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchRelatedSystemIntakesBySystemIntakeIDs(ctx context.Context, intakeIDs []uuid.UUID) ([][]*models.SystemIntake, []error) {
	relatedIntakes, err := d.db.RelatedSystemIntakesBySystemIntakeIDs(ctx, intakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	intakes := helpers.OneToMany(intakeIDs, relatedIntakes)

	return intakes, nil
}

// GetRelatedSystemIntakesBySystemIntakeID gets related intakes by intake ID
func GetRelatedSystemIntakesBySystemIntakeID(ctx context.Context, intakeID uuid.UUID) ([]*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetRelatedSystemIntakesBySystemIntakeID")
	}

	return loaders.SystemIntakeRelatedSystemIntakes.Load(ctx, intakeID)
}

func (d *dataReader) batchRelatedTRBRequestsBySystemIntakeIDs(ctx context.Context, intakeIDs []uuid.UUID) ([][]*models.TRBRequest, []error) {
	relatedTRBRequests, err := d.db.RelatedTRBRequestsBySystemIntakeIDs(ctx, intakeIDs)
	if err != nil {
		return nil, []error{err}
	}

	TRBRequests := helpers.OneToMany(intakeIDs, relatedTRBRequests)

	return TRBRequests, nil
}

// GetRelatedTRBRequestsBySystemIntakeID gets related TRB Requests by system intake ID
func GetRelatedTRBRequestsBySystemIntakeID(ctx context.Context, intakeID uuid.UUID) ([]*models.TRBRequest, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetRelatedTRBRequestsBySystemIntakeID")
	}

	return loaders.SystemIntakeRelatedTRBRequests.Load(ctx, intakeID)
}

func (d *dataReader) batchRelatedSystemIntakesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.SystemIntake, []error) {
	relatedIntakes, err := d.db.RelatedSystemIntakesByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	intakes := helpers.OneToMany(trbRequestIDs, relatedIntakes)

	return intakes, nil
}

// GetRelatedSystemIntakesByTRBRequestID gets related system intakes by TRB Request ID
func GetRelatedSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetRelatedSystemIntakesByTRBRequestID")
	}

	return loaders.TRBRequestRelatedSystemIntakes.Load(ctx, trbRequestID)
}

func (d *dataReader) batchRelatedTRBRequestsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequest, []error) {
	relatedTRBRequests, err := d.db.RelatedTRBRequestsByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	TRBRequests := helpers.OneToMany(trbRequestIDs, relatedTRBRequests)

	return TRBRequests, nil
}

// GetRelatedTRBRequestsByTRBRequestID gets related TRB Requests by TRB Request ID
func GetRelatedTRBRequestsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequest, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetRelatedTRBRequestsByTRBRequestID")
	}

	return loaders.TRBRequestRelatedTRBRequests.Load(ctx, trbRequestID)
}
