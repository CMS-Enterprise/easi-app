package resolvers

import (
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// UserAccountGetByUsername returns a user account by it's userName
func UserAccountGetByUsername(store *storage.Store, userName string) (*authentication.UserAccount, error) {
	return store.UserAccountGetByUsername(userName)
}
