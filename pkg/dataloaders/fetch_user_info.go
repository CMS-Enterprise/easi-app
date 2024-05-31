package dataloaders

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) fetchUserInfosByEUAUserIDs(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, []error) {
	// not sure about this - will look at
	data, err := d.fetchUserInfos(ctx, euaUserIDs)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}

func FetchUserInfosByEUAUserID(ctx context.Context, euaUserID string) (*models.UserInfo, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil dataloaders in FetchUserInfosByEUAUserID")
	}

	return loaders.FetchUserInfos.Load(ctx, euaUserID)
}
