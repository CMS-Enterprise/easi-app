package integration

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
)

// Since we can't always hit the CEDAR API in tests
// (both for performance and VPN reasons)
// this test can be run in local environments to make sure CEDAR
// is set up.
// Other tests should mock the API
func (s *IntegrationTestSuite) TestCEDARConnection() {
	if s.environment != "local" {
		// TODO: When logger gets added, put in test also and print skips
		return
	}

	req, err := http.NewRequest("GET", "/systems/", nil)
	s.NoError(err)
	rr := httptest.NewRecorder()

	cedarClient := cedar.NewTranslatedClient(os.Getenv("CEDAR_API_KEY"))

	handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Marshal:      json.Marshal,
	}.Handle()(rr, req)

	s.Equal(http.StatusOK, rr.Code)

	var systems models.SystemShorts
	err = json.Unmarshal(rr.Body.Bytes(), &systems)

	s.NoError(err)
	s.NotEqual(len(systems), 0)
	s.NotEmpty(systems[0].ID)
	s.NotEmpty(systems[0].Name)
	s.NotEmpty(systems[0].Acronym)
}
