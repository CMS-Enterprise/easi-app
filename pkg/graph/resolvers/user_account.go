package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/userhelpers"
)

// UserAccountGetByUsername returns a user account by it's userName
func UserAccountGetByUsername(store *storage.Store, userName string) (*authentication.UserAccount, error) {

	return store.UserAccountGetByUsername(userName)

}

// UserAccountGetByIDLOADER returns a user account by it's internal ID, utilizing a data loader
func UserAccountGetByIDLOADER(ctx context.Context, id uuid.UUID) (*authentication.UserAccount, error) {
	return userhelpers.UserAccountGetByIDLOADER(ctx, id)

}

// UserAccountsGetByIDs returns a list of user account by it's internal ID
func UserAccountsGetByIDs(logger *zap.Logger, store *storage.Store, ids []uuid.UUID) ([]*authentication.UserAccount, error) {

	//TODO, build the JSON based on the ids. Verify if the generic methodology I wrote previously will work for this. Also use it for the user account data loader if possible ( I took this from there)

	jsonParam, err := models.UUIDArrayToJSONArray(ids, "id")
	if err != nil {
		logger.Error("issue converting uuids to JSON for User Accounts", zap.Error(err))
	}
	return store.UserAccountGetByIDLOADER(logger, jsonParam)

}
