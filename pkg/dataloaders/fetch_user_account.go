package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/authentication"
)

func (d *dataReader) getUserAccountByID(ctx context.Context, userIDs []uuid.UUID) ([]*authentication.UserAccount, []error) {
	data, err := d.db.UserAccountByIDLOADER(ctx, userIDs)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}

func GetUserAccountByID(ctx context.Context, userID uuid.UUID) (*authentication.UserAccount, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetUserAccountByID")
	}

	return loaders.GetUserAccounts.Load(ctx, userID)
}
