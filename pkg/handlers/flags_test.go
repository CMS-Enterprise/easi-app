package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"gopkg.in/launchdarkly/go-sdk-common.v2/lduser"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/flags"
)

func (s HandlerTestSuite) TestFlagsHandler() {
	s.Run("golden path passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/flags/", nil)
		s.NoError(err)
		mockFetch := func(FlagClient flags.FlagClient, clientUser lduser.User) flags.FlagValues {
			return flags.FlagValues{"fakeFlag": false}
		}
		config := ld.Config{Offline: true}
		config.Offline = true
		flagClient := flags.NewLocalClient(flags.FlagValues{"foo": "bar"})
		ldUser := lduser.NewAnonymousUser("bar")

		FlagsHandler{
			HandlerBase: s.base,
			FetchFlags:  mockFetch,
			FlagClient:  *flagClient,
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
