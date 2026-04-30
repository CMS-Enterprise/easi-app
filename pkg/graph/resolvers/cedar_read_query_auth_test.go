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
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
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
		{
			name: "cedarBudgetSystemCost",
			call: func() error {
				_, err := resolver.CedarBudgetSystemCost(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "cedarSubSystems",
			call: func() error {
				_, err := resolver.CedarSubSystems(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "cedarContractsBySystem",
			call: func() error {
				_, err := resolver.CedarContractsBySystem(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "cedarThreat",
			call: func() error {
				_, err := resolver.CedarThreat(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "exchanges",
			call: func() error {
				_, err := resolver.Exchanges(ctx, cedarSystemID)
				return err
			},
		},
		{
			name: "deployments",
			call: func() error {
				_, err := resolver.Deployments(ctx, cedarSystemID, nil, nil, nil)
				return err
			},
		},
		{
			name: "urls",
			call: func() error {
				_, err := resolver.Urls(ctx, cedarSystemID)
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

func TestCedarSystemProfileQueriesRequireEASI(t *testing.T) {
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

	cedarSystemID := uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")
	easiCtx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "USR1",
		JobCodeEASi: true,
		UserAccount: &authentication.UserAccount{Username: "USR1"},
	})
	grtCtx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "GRT1",
		JobCodeGRT:  true,
		UserAccount: &authentication.UserAccount{Username: "GRT1"},
	})
	teamMemberCtx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "ABCD",
		UserAccount: &authentication.UserAccount{Username: "ABCD"},
	})

	testCases := []struct {
		name string
		call func(context.Context) (any, error)
	}{
		{
			name: "cedarBudgetSystemCost",
			call: func(ctx context.Context) (any, error) {
				return resolver.CedarBudgetSystemCost(ctx, cedarSystemID)
			},
		},
		{
			name: "cedarSubSystems",
			call: func(ctx context.Context) (any, error) {
				return resolver.CedarSubSystems(ctx, cedarSystemID)
			},
		},
		{
			name: "cedarContractsBySystem",
			call: func(ctx context.Context) (any, error) {
				return resolver.CedarContractsBySystem(ctx, cedarSystemID)
			},
		},
		{
			name: "cedarThreat",
			call: func(ctx context.Context) (any, error) {
				return resolver.CedarThreat(ctx, cedarSystemID)
			},
		},
		{
			name: "exchanges",
			call: func(ctx context.Context) (any, error) {
				return resolver.Exchanges(ctx, cedarSystemID)
			},
		},
		{
			name: "deployments",
			call: func(ctx context.Context) (any, error) {
				return resolver.Deployments(ctx, cedarSystemID, nil, nil, nil)
			},
		},
		{
			name: "urls",
			call: func(ctx context.Context) (any, error) {
				return resolver.Urls(ctx, cedarSystemID)
			},
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			result, err := tc.call(easiCtx)
			require.NoError(t, err)
			require.NotNil(t, result)

			for _, ctx := range []context.Context{grtCtx, teamMemberCtx} {
				_, err = tc.call(ctx)
				require.Error(t, err)

				var unauthorizedErr *apperrors.UnauthorizedError
				require.True(t, errors.As(err, &unauthorizedErr))
			}
		})
	}
}

func TestCedarSystemWorkspaceAllowsTeamMemberWithoutEASI(t *testing.T) {
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
		EUAID:       "ABCD",
		UserAccount: &authentication.UserAccount{Username: "ABCD"},
	})
	cedarSystemID := uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")

	workspace, err := resolver.CedarSystemWorkspace(ctx, cedarSystemID)
	require.NoError(t, err)
	require.NotNil(t, workspace)
	require.NotNil(t, workspace.CedarSystem)
	require.True(t, workspace.IsMySystem)

	_, err = resolver.CedarAuthorityToOperate(ctx, cedarSystemID)
	require.Error(t, err)

	var unauthorizedErr *apperrors.UnauthorizedError
	require.True(t, errors.As(err, &unauthorizedErr))
}

func TestMyCedarSystemsAllowsTeamMemberWithoutEASI(t *testing.T) {
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
		EUAID:       "ABCD",
		UserAccount: &authentication.UserAccount{Username: "ABCD"},
	})

	systems, err := resolver.MyCedarSystems(ctx)
	require.NoError(t, err)
	require.NotEmpty(t, systems)
}

func TestCedarSystemViewerCapabilitiesAccessMatrix(t *testing.T) {
	t.Parallel()

	cedarCoreClient := cedarcore.NewClient(
		appcontext.WithLogger(context.Background(), zap.NewNop()),
		"fake",
		"fake",
		"1.0.0",
		false,
		true,
	)
	queryResolver := &queryResolver{&Resolver{cedarCoreClient: cedarCoreClient}}
	typeResolver := &cedarSystemResolver{&Resolver{cedarCoreClient: cedarCoreClient}}

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(
			nil,
			func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) {
				return cedarCoreClient.GetSystemSummary(ctx)
			},
			func(ctx context.Context, euaUserID string) ([]*models.CedarSystem, error) {
				return cedarCoreClient.GetSystemSummary(ctx, cedarcore.SystemSummaryOpts.WithEuaIDFilter(euaUserID))
			},
		)
	}

	withLoaders := func(ctx context.Context) context.Context {
		return dataloaders.CTXWithLoaders(ctx, buildDataloaders)
	}

	teamMemberCtx := withLoaders(appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "ABCD",
		UserAccount: &authentication.UserAccount{Username: "ABCD"},
	}))
	grtCtx := withLoaders(appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "GRT1",
		JobCodeGRT:  true,
		UserAccount: &authentication.UserAccount{Username: "GRT1"},
	}))
	easiCtx := withLoaders(appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "USR1",
		JobCodeEASi: true,
		UserAccount: &authentication.UserAccount{Username: "USR1"},
	}))

	teamSystems, err := queryResolver.MyCedarSystems(teamMemberCtx)
	require.NoError(t, err)
	require.NotEmpty(t, teamSystems)

	grtSystems, err := queryResolver.MyCedarSystems(grtCtx)
	require.NoError(t, err)
	require.Empty(t, grtSystems)

	offTeamSystem := &models.CedarSystem{ID: uuid.New()}

	viewerCanAccessProfile, err := typeResolver.ViewerCanAccessProfile(teamMemberCtx, teamSystems[0])
	require.NoError(t, err)
	require.False(t, viewerCanAccessProfile)

	viewerCanAccessWorkspace, err := typeResolver.ViewerCanAccessWorkspace(teamMemberCtx, teamSystems[0])
	require.NoError(t, err)
	require.True(t, viewerCanAccessWorkspace)

	viewerCanAccessProfile, err = typeResolver.ViewerCanAccessProfile(grtCtx, offTeamSystem)
	require.NoError(t, err)
	require.False(t, viewerCanAccessProfile)

	viewerCanAccessWorkspace, err = typeResolver.ViewerCanAccessWorkspace(grtCtx, offTeamSystem)
	require.NoError(t, err)
	require.False(t, viewerCanAccessWorkspace)

	viewerCanAccessProfile, err = typeResolver.ViewerCanAccessProfile(easiCtx, offTeamSystem)
	require.NoError(t, err)
	require.True(t, viewerCanAccessProfile)

	viewerCanAccessWorkspace, err = typeResolver.ViewerCanAccessWorkspace(easiCtx, offTeamSystem)
	require.NoError(t, err)
	require.False(t, viewerCanAccessWorkspace)
}
