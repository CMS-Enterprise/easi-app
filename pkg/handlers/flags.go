package handlers

import (
	"encoding/json"
	"net/http"

	"gopkg.in/launchdarkly/go-sdk-common.v2/lduser"

	"github.com/cmsgov/easi-app/pkg/flags"
)

type fetchFlags func(client flags.FlagClient, user lduser.User) flags.FlagValues

// NewFlagsHandler is a constructor for SystemListHandler
func NewFlagsHandler(base HandlerBase, fetch fetchFlags, flagClient flags.FlagClient, ldUser lduser.User) FlagsHandler {
	return FlagsHandler{HandlerBase: base, FetchFlags: fetch, FlagClient: flagClient, LDUser: ldUser}
}

// FlagsHandler is the handler for listing systems
type FlagsHandler struct {
	HandlerBase
	FetchFlags fetchFlags
	FlagClient flags.FlagClient
	LDUser     lduser.User
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
