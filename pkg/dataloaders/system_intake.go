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
	intakes, err := sqlutils.WithTransactionRet(ctx, d.db, func(tx *sqlx.Tx) ([]*models.SystemIntake, error) {
		output := make([]*models.SystemIntake, len(systemIntakeIDs))

		for index, systemIntakeID := range systemIntakeIDs {
			intake, fetchErr := storage.FetchSystemIntakeByIDNP(ctx, tx, systemIntakeID)
			if fetchErr != nil {
				return nil, fetchErr
			}
			output[index] = intake
		}

		return output, nil
	})
	if err != nil {
		return nil, []error{err}
	}

	return intakes, nil
}

func GetSystemIntakeByID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntake, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in GetSystemIntakeByID")
	}

	return loaders.SystemIntakeByID.Load(ctx, systemIntakeID)
}
