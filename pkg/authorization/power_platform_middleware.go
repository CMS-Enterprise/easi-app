package authorization

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gorilla/mux"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/flags"
	"github.com/cms-enterprise/easi-app/pkg/handlers"
)

type powerPlatformErrorResponse struct {
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

func NewRequirePowerPlatformSystemIntakeEditingMiddleware(
	base handlers.HandlerBase,
	client *ld.LDClient,
) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !isProtectedPowerPlatformWrite(r) {
				next.ServeHTTP(w, r)
				return
			}

			err := flags.GuardSystemIntakeEditing(r.Context(), client)
			if err == nil {
				next.ServeHTTP(w, r)
				return
			}

			if errors.Is(err, flags.ErrPowerPlatformSystemIntakeEditingDenied) {
				writePowerPlatformForbiddenResponse(w)
				return
			}

			base.WriteErrorResponse(r.Context(), w, err)
		})
	}
}

func isProtectedPowerPlatformWrite(r *http.Request) bool {
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		return false
	}

	route := mux.CurrentRoute(r)
	if route == nil {
		return false
	}

	pathTemplate, err := route.GetPathTemplate()
	if err != nil {
		return false
	}

	switch pathTemplate {
	case "/api/v1/business_case":
		return r.Method == http.MethodPost
	case "/api/v1/business_case/{business_case_id}":
		return r.Method == http.MethodPut
	case "/api/v1/system_intake/{intake_id}/actions":
		return r.Method == http.MethodPost
	default:
		return false
	}
}

func writePowerPlatformForbiddenResponse(w http.ResponseWriter) {
	response := powerPlatformErrorResponse{
		Errors: []struct {
			Message string `json:"message"`
		}{
			{Message: flags.PowerPlatformSystemIntakeEditingDeniedMessage},
		},
	}

	responseBody, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusForbidden)
	_, _ = w.Write(responseBody)
}
