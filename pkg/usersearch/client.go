package usersearch

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// Client is a generic interface for userSearch API
type Client interface {
	FetchUserInfo(context.Context, string) (*models.UserInfo, error)
	FetchUserInfos(context.Context, []string) ([]*models.UserInfo, error)
	SearchCommonNameContains(context.Context, string) ([]*models.UserInfo, error)
}
