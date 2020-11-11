package local

import (
	"context"
	"fmt"
	"strings"

	"github.com/cmsgov/easi-app/pkg/models"
)

// LDAPClient mocks the CEDAR LDAP client for local/test use
type LDAPClient struct{}

// FetchUserInfo fetches a user's personal details
func (c LDAPClient) FetchUserInfo(ctx context.Context, euaID string) (*models.UserInfo, error) {
	return &models.UserInfo{
		CommonName: strings.ToLower(euaID),
		Email:      fmt.Sprintf("%s@local.fake", euaID),
		EuaUserID:  euaID,
	}, nil
}
