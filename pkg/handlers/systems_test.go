package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/models"
)

func failMarshal(interface{}) ([]byte, error) {
	return nil, errors.New("failed to marshal")
}

func (s HandlerTestSuite) TestSystemsHandler() {

	s.Run("golden path passes", func() {
		rr := httptest.NewRecorder()
		SystemsListHandler{
			FetchSystems: makeFakeSystemShorts,
			Marshal:      json.Marshal,
		}.Handle()(rr, nil)

		s.Equal(http.StatusOK, rr.Code)

		var systems models.SystemShorts
		err := json.Unmarshal(rr.Body.Bytes(), &systems)

		s.NoError(err)
		s.Len(systems, 3)
		s.Equal("CHSE", systems[0].Acronym)
	})

	s.Run("marshalling fails, returns 500", func() {
		rr := httptest.NewRecorder()
		SystemsListHandler{
			FetchSystems: makeFakeSystemShorts,
			Marshal:      failMarshal,
		}.Handle()(rr, nil)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("failed to fetch systems\n", rr.Body.String())
	})
}

func makeFakeSystemShorts() (models.SystemShorts, error) {
	system1 := models.SystemShort{Acronym: "CHSE", Name: "Cheese"}
	system2 := models.SystemShort{Acronym: "PPRN", Name: "Pepperoni"}
	system3 := models.SystemShort{Acronym: "MTLV", Name: "Meat Lovers"}

	return models.SystemShorts{system1, system2, system3}, nil
}
