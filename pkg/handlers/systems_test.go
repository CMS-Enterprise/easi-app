package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s HandlerTestSuite) TestSystemsHandler() {

	s.Run("golden path passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/systems/", nil)
		s.NoError(err)
		SystemsListHandler{
			FetchSystems: makeFakeSystemShorts,
			HandlerBase:  s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

		var systems models.SystemShorts
		err = json.Unmarshal(rr.Body.Bytes(), &systems)

		s.NoError(err)
		s.Len(systems, 3)
		s.Equal("CHSE", systems[0].Acronym)
	})
}

func makeFakeSystemShorts(_ context.Context) (models.SystemShorts, error) {
	system1 := models.SystemShort{Acronym: "CHSE", Name: "Cheese"}
	system2 := models.SystemShort{Acronym: "PPRN", Name: "Pepperoni"}
	system3 := models.SystemShort{Acronym: "MTLV", Name: "Meat Lovers"}

	return models.SystemShorts{system1, system2, system3}, nil
}
