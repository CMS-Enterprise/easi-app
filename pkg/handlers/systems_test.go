package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s HandlerTestSuite) TestSystemsHandler() {
	rr := httptest.NewRecorder()

	SystemsListHandler{FetchSystems: makeFakeSystems}.Handle()(rr, nil)

	s.Equal(http.StatusOK, rr.Code)

	var systems models.Systems
	err := json.Unmarshal(rr.Body.Bytes(), &systems)

	s.NoError(err)
	s.Len(systems, 3)
	s.Equal("CHSE", systems[0].Acronym)
}

func makeFakeSystems() (models.Systems, error) {
	system1 := models.System{Acronym: "CHSE", Name: "Cheese"}
	system2 := models.System{Acronym: "PPRN", Name: "Pepperoni"}
	system3 := models.System{Acronym: "MTLV", Name: "Meat Lovers"}

	return models.Systems{system1, system2, system3}, nil
}
