package dataloaders

import (
	"context"
	"sync/atomic"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/require"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestGetCedarSystemViewerCapabilitiesMemoizesMySystemsLookup(t *testing.T) {
	t.Parallel()

	teamSystemID := uuid.New()
	otherSystemID := uuid.New()

	var mySystemsCalls atomic.Int32

	ctx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "TEST",
		JobCodeEASi: true,
	})
	ctx = CTXWithLoaders(ctx, func() *Dataloaders {
		return NewDataloaders(
			nil,
			nil,
			nil,
			func(context.Context, string) ([]*models.CedarSystem, error) {
				mySystemsCalls.Add(1)
				return []*models.CedarSystem{
					{ID: teamSystemID},
				}, nil
			},
		)
	})

	teamSystemCapabilities, err := GetCedarSystemViewerCapabilities(ctx, teamSystemID)
	require.NoError(t, err)
	require.True(t, teamSystemCapabilities.ViewerCanAccessProfile)
	require.True(t, teamSystemCapabilities.ViewerCanAccessWorkspace)

	otherSystemCapabilities, err := GetCedarSystemViewerCapabilities(ctx, otherSystemID)
	require.NoError(t, err)
	require.True(t, otherSystemCapabilities.ViewerCanAccessProfile)
	require.False(t, otherSystemCapabilities.ViewerCanAccessWorkspace)

	require.Equal(t, int32(1), mySystemsCalls.Load())
}
