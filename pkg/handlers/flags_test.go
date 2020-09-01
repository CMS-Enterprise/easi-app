package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/flags"
)

func (s HandlerTestSuite) TestFlagsHandler() {
	s.Run("golden path passes", func() {
		requestContext := context.Background()
		requestContext = appcontext.WithLDAppEnvUser(requestContext, ld.NewAnonymousUser(""))
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/flags/", nil)
		s.NoError(err)
		mockFetch := func(client ld.LDClient, clientUser ld.User) flags.FlagValues {
			return flags.FlagValues{"fakeFlag": false}
		}
		config := ld.DefaultConfig
		config.Offline = true
		ldClient, err := ld.MakeCustomClient("blah", config, 5*time.Second)
		s.NoError(err)

		FlagsHandler{
			HandlerBase: s.base,
			FetchFlags:  mockFetch,
			LDClient:    *ldClient,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

		var flagValues flags.FlagValues
		err = json.Unmarshal(rr.Body.Bytes(), &flagValues)
		s.NoError(err)
		s.Len(flagValues, 1)
		s.Equal(flagValues["fakeFlag"], false)
	})
}
