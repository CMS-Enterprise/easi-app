package dataloaders

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

func (d *dataReader) getUserAccountByID(ctx context.Context, userIDs []uuid.UUID) ([]*authentication.UserAccount, []error) {
	data, err := d.db.UserAccountsByIDs(ctx, userIDs)
	if err != nil {
		return nil, []error{err}
	}

	accountMap := map[uuid.UUID]*authentication.UserAccount{}

	// populate
	for _, account := range data {
		accountMap[account.ID] = account
	}

	// order
	var result []*authentication.UserAccount
	for _, id := range userIDs {
		val, ok := accountMap[id]
		if !ok {
			appcontext.ZLogger(ctx).Warn("account not found for user", zap.String("user.id", id.String()))
			// insert an empty? - not sure
			val = &authentication.UserAccount{}
		}
		result = append(result, val)
	}

	return result, nil
}

func GetUserAccountByID(ctx context.Context, userID uuid.UUID) (*authentication.UserAccount, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetUserAccountByID")
	}

	return loaders.GetUserAccounts.Load(ctx, userID)
}
