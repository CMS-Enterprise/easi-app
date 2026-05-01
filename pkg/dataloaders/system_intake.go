package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func (d *dataReader) batchSystemIntakesByID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntake, []error) {
	intakes := make([]*models.SystemIntake, len(systemIntakeIDs))
	errs := make([]error, len(systemIntakeIDs))

	err := sqlutils.WithTransaction(ctx, d.db, func(tx *sqlx.Tx) error {
		for index, systemIntakeID := range systemIntakeIDs {
			intake, fetchErr := storage.FetchSystemIntakeByIDNP(ctx, tx, systemIntakeID)
			if fetchErr != nil {
				errs[index] = fetchErr
				continue
			}
			intakes[index] = intake
		}

		return nil
	})
	if err != nil {
		return nil, []error{err}
	}

	return intakes, errs
}

func GetSystemIntakeByID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetSystemIntakeByID")
	}

	return loaders.SystemIntakeByID.Load(ctx, systemIntakeID)
}
