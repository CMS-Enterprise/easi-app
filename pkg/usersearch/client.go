package usersearch

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

type Client interface {
	FetchUserInfo(context.Context, string) (*models.UserInfo, error)
	FetchUserInfos(context.Context, []string) ([]*models.UserInfo, error)
	SearchCommonNameContains(context.Context, string) ([]*models.UserInfo, error)
}
