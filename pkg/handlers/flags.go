package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/flags"
)

type fetchFlags func(client ld.LDClient, clientUser ld.User) flags.FlagValues

// NewFlagsHandler is a constructor for SystemListHandler
func NewFlagsHandler(base HandlerBase, fetch fetchFlags, client ld.LDClient) FlagsHandler {
	return FlagsHandler{HandlerBase: base, FetchFlags: fetch, LDClient: client}
}

// FlagsHandler is the handler for listing systems
type FlagsHandler struct {
	HandlerBase
	FetchFlags fetchFlags
	LDClient   ld.LDClient
}

// Handle handles a web request and returns a list of flags
func (h FlagsHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ldUser, ok := appcontext.LDAppEnvUser(r.Context())
		if !ok {
			h.WriteErrorResponse(r.Context(), w, fmt.Errorf("something went wrong in fetching flags"))
			return
		}

		ldFlags := h.FetchFlags(h.LDClient, ldUser)
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
