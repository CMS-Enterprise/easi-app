package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func (d *dataReader) batchSystemIntakesByID(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntake, []error) {
	intakes := make([]*models.SystemIntake, len(systemIntakeIDs))
	errs := make([]error, len(systemIntakeIDs))

	err := sqlutils.WithTransaction(ctx, d.db, func(tx *sqlx.Tx) error {
		fetchedIntakes, fetchErr := storage.FetchSystemIntakesByIDNP(ctx, tx, systemIntakeIDs)
		if fetchErr != nil {
			return fetchErr
		}

		intakesByID := make(map[uuid.UUID]*models.SystemIntake, len(fetchedIntakes))
		for index := range fetchedIntakes {
			intake := fetchedIntakes[index]
			intakesByID[intake.ID] = &fetchedIntakes[index]
		}

		for index, systemIntakeID := range systemIntakeIDs {
			intake, ok := intakesByID[systemIntakeID]
			if !ok {
				errs[index] = &apperrors.ResourceNotFoundError{
					Err:      errors.New("system intake not found"),
					Resource: models.SystemIntake{},
				}
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
