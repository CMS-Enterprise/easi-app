package integration

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/services"
)

// TODO: We need to sub this out with a test that hooks up Okta
// Likely also run with `server.Serve()`
func (s *IntegrationTestSuite) TestSystemsRoute() {
	req, err := http.NewRequest("GET", "/systems/", nil)
	s.NoError(err)
	rr := httptest.NewRecorder()

	handlers.SystemsListHandler{
		FetchSystems: services.NewFetchFakeSystems(),
		Logger:       s.logger,
	}.Handle()(rr, req)

	s.Equal(http.StatusOK, rr.Code)

	var systems models.SystemShorts
	err = json.Unmarshal(rr.Body.Bytes(), &systems)

	s.NoError(err)
	s.Len(systems, 10)
	s.Equal("GRPE", systems[0].Acronym)
}
