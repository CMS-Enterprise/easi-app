package resolvers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/stretchr/testify/require"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
)

func TestGetCedarSystemWorkspaceGracefullyHandlesRoleLookupFailure(t *testing.T) {
	t.Parallel()

	const systemName = "Test Workspace System"

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.URL.Path {
		case "/gateway/CEDAR Core API/1.0.0/system/summary":
			// The auth check filters by team membership; the follow-up system
			// lookup does not. Both calls should still succeed.
			if userName := r.URL.Query().Get("userName"); userName != "" {
				require.Equal(t, "ABCD", userName)
				require.Equal(t, "active", r.URL.Query().Get("state"))
			}

			require.NoError(t, json.NewEncoder(w).Encode(map[string]any{
				"SystemSummary": []map[string]any{
					{
						"id":          testCedarSystemID.String(),
						"ictObjectId": testCedarSystemID.String(),
						"name":        systemName,
						"version":     "1.0",
					},
				},
				"count": 1,
			}))
		case "/gateway/CEDAR Core API/1.0.0/role":
			require.Equal(t, "alfabet", r.URL.Query().Get("application"))
			require.Equal(t, testCedarSystemID.String(), r.URL.Query().Get("objectId"))

			w.WriteHeader(http.StatusInternalServerError)
			require.NoError(t, json.NewEncoder(w).Encode(map[string]any{
				"message": []string{"role lookup failed"},
				"result":  "error",
			}))
		default:
			t.Fatalf("unexpected request path: %s", r.URL.Path)
		}
	}))
	defer server.Close()

	serverURL, err := url.Parse(server.URL)
	require.NoError(t, err)

	cedarCoreClient := cedarcore.NewClient(
		appcontext.WithLogger(context.Background(), zap.NewNop()),
		serverURL.Host,
		"fake",
		"1.0.0",
		false,
	)

	ctx := appcontext.WithPrincipal(context.Background(), &authentication.EUAPrincipal{
		EUAID:       "ABCD",
		UserAccount: &authentication.UserAccount{Username: "ABCD"},
	})

	workspace, err := GetCedarSystemWorkspace(ctx, cedarCoreClient, testCedarSystemID)
	require.NoError(t, err)
	require.NotNil(t, workspace)
	require.NotNil(t, workspace.CedarSystem)
	require.Equal(t, testCedarSystemID, workspace.ID)
	require.Equal(t, systemName, workspace.CedarSystem.Name)
	require.True(t, workspace.IsMySystem)
	require.Nil(t, workspace.Roles)
}
