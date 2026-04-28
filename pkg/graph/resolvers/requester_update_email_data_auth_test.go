package resolvers

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func TestRequesterUpdateEmailDataRejectsNonGRTUsers(t *testing.T) {
	t.Parallel()

	resolver := &queryResolver{&Resolver{}}
	ctx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "USR1",
		JobCodeEASi: true,
		UserAccount: &authentication.UserAccount{Username: "USR1"},
	})

	_, err := resolver.RequesterUpdateEmailData(ctx)
	require.Error(t, err)

	var unauthorizedErr *apperrors.UnauthorizedError
	require.True(t, errors.As(err, &unauthorizedErr))
}
