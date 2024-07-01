package dataloaders

import (
	"context"
	"errors"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (d *dataReader) fetchUserInfosByEUAUserIDs(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, []error) {
	data, err := d.fetchUserInfos(ctx, euaUserIDs)
	if err != nil {
		return nil, []error{err}
	}

	store := map[string]*models.UserInfo{}

	for _, info := range data {
		store[info.Username] = info
	}

	var out []*models.UserInfo
	for _, id := range euaUserIDs {
		out = append(out, store[id])
	}

	return out, nil
}

func FetchUserInfoByEUAUserID(ctx context.Context, euaUserID string) (*models.UserInfo, error) {
	loaders, ok := loadersFromCTX(ctx)
	if !ok {
		return nil, errors.New("unexpected nil dataloaders in FetchUserInfoByEUAUserID")
	}

	return loaders.FetchUserInfo.Load(ctx, euaUserID)
}
