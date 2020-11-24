package handlers

import (
	"encoding/json"
	"net/http"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/flags"
)

// NewFlagsHandler is a constructor for SystemListHandler
func NewFlagsHandler(base HandlerBase, flagClient *ld.LDClient, lduser ld.User) FlagsHandler {
	return FlagsHandler{HandlerBase: base, FlagClient: flagClient, LDUser: lduser}
}

// FlagsHandler is the handler for listing systems
type FlagsHandler struct {
	HandlerBase
	FlagClient *ld.LDClient
	LDUser     ld.User
}

// Handle handles a web request and returns a list of flags
func (h FlagsHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		results := flags.FlagValues{}
		valuesMap := h.FlagClient.AllFlagsState(h.LDUser, ld.ClientSideOnly).ToValuesMap()
		for k, v := range valuesMap {
			results[k] = v
		}
		responseBody, err := json.Marshal(results)
		if err != nil {
			h.WriteErrorResponse(r.Context(), w, err)
			return
		}

		_, err = w.Write(responseBody)
		if err != nil {
			h.WriteErrorResponse(r.Context(), w, err)
			return
		}
		return
	}
}
