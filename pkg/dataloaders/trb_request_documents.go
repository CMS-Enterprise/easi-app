package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) batchTRBRequestDocumentsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestDocument, []error) {
	data, err := d.db.GetTRBRequestDocumentsByRequestIDs(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return helpers.OneToMany(trbRequestIDs, data), nil
}

func GetTRBRequestDocumentsByRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestDocument, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil loaders in GetTRBRequestDocumentsByRequestID")
	}

	return loaders.TRBRequestDocuments.Load(ctx, trbRequestID)
}
