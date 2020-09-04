package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/flags"
)

func (s HandlerTestSuite) TestFlagsHandler() {
	s.Run("golden path passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/flags/", nil)
		s.NoError(err)
		mockFetch := func(client ld.LDClient, clientUser ld.User) flags.FlagValues {
			return flags.FlagValues{"fakeFlag": false}
		}
		config := ld.DefaultConfig
		config.Offline = true
		ldClient, err := ld.MakeCustomClient("foo", config, 5*time.Second)
		ldUser := ld.NewAnonymousUser("bar")
		s.NoError(err)

		FlagsHandler{
			HandlerBase: s.base,
			FetchFlags:  mockFetch,
			LDClient:    *ldClient,
			LDUser:      ldUser,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

		var flagValues flags.FlagValues
		err = json.Unmarshal(rr.Body.Bytes(), &flagValues)
		s.NoError(err)
		s.Len(flagValues, 1)
		s.Equal(flagValues["fakeFlag"], false)
	})
}
