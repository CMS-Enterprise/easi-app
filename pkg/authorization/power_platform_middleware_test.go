package authorization

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/flags"
	"github.com/cms-enterprise/easi-app/pkg/handlers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func newPowerPlatformTestClient(t *testing.T, enabled bool) *ld.LDClient {
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

func withTestPrincipal(req *http.Request) *http.Request {
	principal := &authentication.EUAPrincipal{
		EUAID:       "FAKE",
		JobCodeEASi: true,
	}

	return req.WithContext(appcontext.WithPrincipal(context.Background(), principal))
}

func TestPowerPlatformMiddlewareBlocksProtectedWrites(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, true)

	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

	handlerRan := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerRan = true
		w.WriteHeader(http.StatusCreated)
	})

	api.Handle("/business_case", testHandler).Methods(http.MethodPost)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/business_case", nil)
	req = withTestPrincipal(req)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.False(t, handlerRan)
	assert.Equal(t, http.StatusForbidden, rr.Code)

	var payload struct {
		Errors []struct {
			Message string `json:"message"`
		} `json:"errors"`
	}
	err := json.Unmarshal(rr.Body.Bytes(), &payload)
	require.NoError(t, err)
	require.Len(t, payload.Errors, 1)
	assert.Equal(t, flags.PowerPlatformSystemIntakeEditingDeniedMessage, payload.Errors[0].Message)
}

func TestPowerPlatformMiddlewareBlocksBusinessCaseUpdate(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, true)

	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

	handlerRan := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerRan = true
		w.WriteHeader(http.StatusOK)
	})

	api.Handle("/business_case/{business_case_id}", testHandler).Methods(http.MethodPut)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/business_case/550e8400-e29b-41d4-a716-446655440000", nil)
	req = withTestPrincipal(req)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.False(t, handlerRan)
	assert.Equal(t, http.StatusForbidden, rr.Code)
}

func TestPowerPlatformMiddlewareBlocksSystemIntakeActions(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, true)

	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

	handlerRan := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerRan = true
		w.WriteHeader(http.StatusCreated)
	})

	api.Handle("/system_intake/{intake_id}/actions", testHandler).Methods(http.MethodPost)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/system_intake/550e8400-e29b-41d4-a716-446655440000/actions", nil)
	req = withTestPrincipal(req)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.False(t, handlerRan)
	assert.Equal(t, http.StatusForbidden, rr.Code)
}

func TestPowerPlatformMiddlewareBlocksBusinessCaseSubmitActions(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, true)

	tests := []struct {
		name       string
		actionType models.ActionType
	}{
		{
			name:       "draft business case submit",
			actionType: models.ActionTypeSUBMITBIZCASE,
		},
		{
			name:       "final business case submit",
			actionType: models.ActionTypeSUBMITFINALBIZCASE,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := mux.NewRouter()
			api := router.PathPrefix("/api/v1").Subrouter()
			api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

			handlerRan := false
			testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				handlerRan = true
				w.WriteHeader(http.StatusCreated)
			})

			api.Handle("/system_intake/{intake_id}/actions", testHandler).Methods(http.MethodPost)

			requestBody, err := json.Marshal(map[string]string{
				"actionType": string(tt.actionType),
			})
			require.NoError(t, err)

			req := httptest.NewRequest(
				http.MethodPost,
				"/api/v1/system_intake/550e8400-e29b-41d4-a716-446655440000/actions",
				strings.NewReader(string(requestBody)),
			)
			req.Header.Set("Content-Type", "application/json")
			req = withTestPrincipal(req)
			rr := httptest.NewRecorder()

			router.ServeHTTP(rr, req)

			assert.False(t, handlerRan)
			assert.Equal(t, http.StatusForbidden, rr.Code)

			var payload struct {
				Errors []struct {
					Message string `json:"message"`
				} `json:"errors"`
			}
			err = json.Unmarshal(rr.Body.Bytes(), &payload)
			require.NoError(t, err)
			require.Len(t, payload.Errors, 1)
			assert.Equal(t, flags.PowerPlatformSystemIntakeEditingDeniedMessage, payload.Errors[0].Message)
		})
	}
}

func TestPowerPlatformMiddlewareAllowsProtectedReads(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, true)

	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

	handlerRan := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerRan = true
		w.WriteHeader(http.StatusOK)
	})

	api.Handle("/business_case/{business_case_id}", testHandler).Methods(http.MethodGet)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/business_case/550e8400-e29b-41d4-a716-446655440000", nil)
	req = withTestPrincipal(req)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.True(t, handlerRan)
	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestPowerPlatformMiddlewareAllowsUnprotectedWrites(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, true)

	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

	handlerRan := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerRan = true
		w.WriteHeader(http.StatusCreated)
	})

	api.Handle("/feedback_email", testHandler).Methods(http.MethodPost)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/feedback_email", nil)
	req = withTestPrincipal(req)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.True(t, handlerRan)
	assert.Equal(t, http.StatusCreated, rr.Code)
}

func TestPowerPlatformMiddlewareAllowsProtectedWritesWhenFlagDisabled(t *testing.T) {
	base := handlers.NewHandlerBase()
	client := newPowerPlatformTestClient(t, false)

	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	api.Use(NewRequirePowerPlatformSystemIntakeEditingMiddleware(base, client))

	handlerRan := false
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlerRan = true
		w.WriteHeader(http.StatusCreated)
	})

	api.Handle("/business_case", testHandler).Methods(http.MethodPost)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/business_case", nil)
	req = withTestPrincipal(req)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.True(t, handlerRan)
	assert.Equal(t, http.StatusCreated, rr.Code)
}
