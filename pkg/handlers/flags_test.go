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
		config := ld.DefaultConfig
		config.Offline = true
		flagClient, ferr := ld.MakeCustomClient("nada", ld.Config{Offline: true}, 0)
		s.NoError(ferr)
		ldUser := ld.NewAnonymousUser("bar")

		FlagsHandler{
			HandlerBase: s.base,
			FlagClient:  flagClient,
			LDUser:      ldUser,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

		var flagValues flags.FlagValues
		err = json.Unmarshal(rr.Body.Bytes(), &flagValues)
		s.NoError(err)
		s.Len(flagValues, 0) // ofline mode == no flags configured
		s.Equal(flagValues["fakeFlag"], nil)
	})
}
