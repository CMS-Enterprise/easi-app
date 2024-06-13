package dataloaders

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) fetchUserInfosByEUAUserIDs(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, []error) {
	data, err := d.fetchUserInfos(ctx, euaUserIDs)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}

func FetchUserInfoByEUAUserID(ctx context.Context, euaUserID string) (*models.UserInfo, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in FetchUserInfoByEUAUserID")
	}

	return loaders.FetchUserInfo.Load(ctx, euaUserID)
}
