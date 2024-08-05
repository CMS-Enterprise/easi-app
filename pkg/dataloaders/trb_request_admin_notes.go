package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestAdminNotesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBAdminNote, []error) {
	data, err := d.db.GetTRBAdminNotesByTRBRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBAdminNotesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBAdminNote, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBAdminNotesByTRBRequestID")
	}

	return loaders.TRBRequestAdminNotes.Load(ctx, trbRequestID)
}
