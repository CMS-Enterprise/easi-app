package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"

	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/flags"
)

func (s HandlerTestSuite) TestFlagsHandler() {
	s.Run("golden path passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/flags/", nil)
		s.NoError(err)
		mockFetch := func(FlagClient flags.FlagClient, clientUser ld.User) flags.FlagValues {
			return flags.FlagValues{"fakeFlag": false}
		}
		config := ld.DefaultConfig
		config.Offline = true
		flagClient, ferr := flags.NewLaunchDarklyClient(flags.Config{Offline: true})
		s.NoError(ferr)
		ldUser := ld.NewAnonymousUser("bar")

		FlagsHandler{
			HandlerBase: s.base,
			FetchFlags:  mockFetch,
			FlagClient:  flagClient,
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
