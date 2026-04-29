package resolvers

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestCedarReadQueryResolversRejectNonEASIUsers(t *testing.T) {
	t.Parallel()

	resolver := &queryResolver{&Resolver{
		service: ResolverService{
			SearchCommonNameContains: func(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
				return []*models.UserInfo{}, nil
			},
		},
		cedarCoreClient: cedarcore.NewClient(
			appcontext.WithLogger(context.Background(), zap.NewNop()),
			"fake",
			"fake",
			"1.0.0",
			false,
			true,
		),
	}}

	ctx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "USR1",
		UserAccount: &authentication.UserAccount{Username: "USR1"},
	})
	cedarSystemID := uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")

	testCases := []struct {
		name string
		call func() error
	}{
		{
			name: "cedarSystems",
			call: func() error {
				_, err := resolver.CedarSystems(ctx)
				return err
			},
		},
		{
			name: "cedarSystem",
			call: func() error {
				_, err := resolver.CedarSystem(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "cedarSystemDetails",
			call: func() error {
				_, err := resolver.CedarSystemDetails(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "cedarPersonsByCommonName",
			call: func() error {
				_, err := resolver.CedarPersonsByCommonName(ctx, "AB")
				return err
			},
		},
		{
			name: "cedarSystemBookmarks",
			call: func() error {
				_, err := resolver.CedarSystemBookmarks(ctx)
				return err
			},
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			err := tc.call()
			require.Error(t, err)

			var unauthorizedErr *apperrors.UnauthorizedError
			require.True(t, errors.As(err, &unauthorizedErr))
		})
	}
}

func TestCedarSystemsAllowsGRTWithoutEASI(t *testing.T) {
	t.Parallel()

	resolver := &queryResolver{&Resolver{
		service: ResolverService{
			SearchCommonNameContains: func(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
				return []*models.UserInfo{}, nil
			},
		},
		cedarCoreClient: cedarcore.NewClient(
			appcontext.WithLogger(context.Background(), zap.NewNop()),
			"fake",
			"fake",
			"1.0.0",
			false,
			true,
		),
	}}

	ctx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "GRT1",
		JobCodeGRT:  true,
		UserAccount: &authentication.UserAccount{Username: "GRT1"},
	})
	cedarSystemID := uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")

	require.NoError(t, authorizeUserCanAccessCEDARSystemDirectory(ctx))

	systems, err := resolver.CedarSystems(ctx)
	require.NoError(t, err)
	require.NotNil(t, systems)

	_, err = resolver.CedarAuthorityToOperate(ctx, cedarSystemID)
	require.Error(t, err)

	var unauthorizedErr *apperrors.UnauthorizedError
	require.True(t, errors.As(err, &unauthorizedErr))
}
