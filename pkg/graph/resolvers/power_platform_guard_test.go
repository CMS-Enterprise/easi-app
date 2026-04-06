package resolvers

import (
	"context"
	"testing"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/flags"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func newResolverPowerPlatformTestClient(t *testing.T, enabled bool) *ld.LDClient {
	t.Helper()

	td := ldtestdata.DataSource()
	td.Update(td.Flag("enablePowerPlatform").BooleanFlag().VariationForAll(enabled))

	client, err := ld.MakeCustomClient("", ld.Config{
		DataSource: td,
		Events:     ldcomponents.NoEvents(),
	}, time.Second)
	require.NoError(t, err)

	t.Cleanup(func() {
		require.NoError(t, client.Close())
	})

	return client
}

func testResolverContext() context.Context {
	principal := &authentication.EUAPrincipal{
		EUAID:       "FAKE",
		JobCodeEASi: true,
	}

	return appcontext.WithPrincipal(context.Background(), principal)
}

func TestMutationResolverBlocksCreateSystemIntakeWhenPowerPlatformEnabled(t *testing.T) {
	resolver := &mutationResolver{
		&Resolver{
			ldClient: newResolverPowerPlatformTestClient(t, true),
		},
	}

	result, err := resolver.CreateSystemIntake(testResolverContext(), models.CreateSystemIntakeInput{
		RequestType: models.SystemIntakeRequestTypeNEW,
	})

	require.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, flags.PowerPlatformSystemIntakeEditingDeniedMessage, err.Error())
}

func TestMutationResolverBlocksDeleteSystemIntakeGRBReviewerWhenPowerPlatformEnabled(t *testing.T) {
	resolver := &mutationResolver{
		&Resolver{
			ldClient: newResolverPowerPlatformTestClient(t, true),
		},
	}

	result, err := resolver.DeleteSystemIntakeGRBReviewer(testResolverContext(), models.DeleteSystemIntakeGRBReviewerInput{
		ReviewerID: uuid.New(),
	})

	require.Error(t, err)
	assert.Equal(t, uuid.Nil, result)
	assert.Equal(t, flags.PowerPlatformSystemIntakeEditingDeniedMessage, err.Error())
}

func TestMutationResolverBlocksCreateSystemIntakeDocumentWhenPowerPlatformEnabled(t *testing.T) {
	resolver := &mutationResolver{
		&Resolver{
			ldClient: newResolverPowerPlatformTestClient(t, true),
		},
	}

	result, err := resolver.CreateSystemIntakeDocument(testResolverContext(), models.CreateSystemIntakeDocumentInput{
		RequestID:    uuid.New(),
		FileData:     graphql.Upload{},
		DocumentType: models.SystemIntakeDocumentCommonTypeDraftIGCE,
		Version:      models.SystemIntakeDocumentVersionCURRENT,
	})

	require.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, flags.PowerPlatformSystemIntakeEditingDeniedMessage, err.Error())
}

func TestMutationResolverBlocksDeleteSystemIntakeDocumentWhenPowerPlatformEnabled(t *testing.T) {
	resolver := &mutationResolver{
		&Resolver{
			ldClient: newResolverPowerPlatformTestClient(t, true),
		},
	}

	result, err := resolver.DeleteSystemIntakeDocument(testResolverContext(), uuid.New())

	require.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, flags.PowerPlatformSystemIntakeEditingDeniedMessage, err.Error())
}
