package handlers

import (
	"encoding/json"
	"net/http"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/flags"
)

type fetchFlags func(client flags.FlagClient, user ld.User) flags.FlagValues

// NewFlagsHandler is a constructor for SystemListHandler
func NewFlagsHandler(base HandlerBase, fetch fetchFlags, flagClient flags.FlagClient, lduser ld.User) FlagsHandler {
	return FlagsHandler{HandlerBase: base, FetchFlags: fetch, FlagClient: flagClient, LDUser: lduser}
}

// FlagsHandler is the handler for listing systems
type FlagsHandler struct {
	HandlerBase
	FetchFlags fetchFlags
	FlagClient flags.FlagClient
	LDUser     ld.User
}

// Handle handles a web request and returns a list of flags
func (h FlagsHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ldFlags := h.FetchFlags(h.FlagClient, h.LDUser)
		responseBody, err := json.Marshal(ldFlags)
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
