package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestAttendeesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestAttendee, []error) {
	data, err := d.db.GetTRBRequestAttendeesByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBAttendeesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestAttendee, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBAttendeesByTRBRequestID")
	}

	return loaders.TRBRequestAttendees.Load(ctx, trbRequestID)
}

func (d *dataReader) batchTRBRequestAttendeesByEUAIDsAndTRBRequestIDs(ctx context.Context, requests []models.TRBAttendeeByTRBAndEUAIDRequest) ([]*models.TRBRequestAttendee, []error) {
	// split requests into separate slices maintaining the same order
	var (
		trbRequestIDs = make([]uuid.UUID, len(requests))
		euaIDs        = make([]string, len(requests))
	)
	for i, req := range requests {
		trbRequestIDs[i] = req.TRBRequestID
		euaIDs[i] = req.EUAUserID
	}

	data, err := d.db.GetAttendeesByEUAIDsAndTRBIDs(ctx, euaIDs, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToOne(trbRequestIDs, data), nil
}

func GetTRBAttendeeByEUAIDAndTRBRequestID(ctx context.Context, euaID string, trbRequestID uuid.UUID) (*models.TRBRequestAttendee, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBAttendeesByEUAIDAndTRBRequestID")
	}

	return loaders.TRBRequestAttendeeByEUA.Load(ctx, models.TRBAttendeeByTRBAndEUAIDRequest{
		EUAUserID:    euaID,
		TRBRequestID: trbRequestID,
	})
}
