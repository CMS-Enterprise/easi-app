package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// UserAccountGetByUsername returns a user account by it's userName
func UserAccountGetByUsername(ctx context.Context, store *storage.Store, np sqlutils.NamedPreparer, userName string) (*authentication.UserAccount, error) {
	return storage.UserAccountGetByUsername(ctx, np, userName)
}

// GetUserAccountByID returns a user account by its internal ID, utilizing a dataloader
func GetUserAccountByID(ctx context.Context, id uuid.UUID) (*authentication.UserAccount, error) {
	return dataloaders.GetUserAccountByID(ctx, id)
}
