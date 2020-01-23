package integration

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/services"
)

func (s *IntegrationTestSuite) TestSystemsRoute() {
	req, err := http.NewRequest("GET", "/systems/", nil)
	s.NoError(err)
	rr := httptest.NewRecorder()

	handlers.SystemsListHandler{FetchSystems: services.NewFetchFakeSystems()}.Handle()(rr, req)

	s.Equal(http.StatusOK, rr.Code)

	var systems models.Systems
	err = json.Unmarshal(rr.Body.Bytes(), &systems)

	s.NoError(err)
	s.Len(systems, 10)
	s.Equal("GRPE", systems[0].Acronym)
}
