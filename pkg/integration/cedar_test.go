package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/cmsgov/easi-app/pkg/appconfig"
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
	if s.environment != appconfig.LocalEnv.String() {
		fmt.Println("Skipped 'TestCEDARConnection' test")
		return
	}

	req, err := http.NewRequest("GET", "/systems/", nil)
	s.NoError(err)
	rr := httptest.NewRecorder()

	cedarClient := cedar.NewTranslatedClient(
		s.config.GetString("CEDAR_API_URL"),
		s.config.GetString("CEDAR_API_KEY"),
	)

	handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Logger:       s.logger,
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
