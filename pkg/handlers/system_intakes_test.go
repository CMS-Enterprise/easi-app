package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockFetchSystemIntakes(systemIntakes models.SystemIntakes, err error) fetchSystemIntakes {
	return func(context context.Context, filter models.SystemIntakeStatusFilter) (models.SystemIntakes, error) {
		return systemIntakes, err
	}
}

func (s HandlerTestSuite) TestSystemIntakesHandler() {
	s.Run("golden path FETCH passes", func() {
		rr := httptest.NewRecorder()
		requestContext := context.Background()
		requestContext = appcontext.WithPrincipal(requestContext, &authentication.EUAPrincipal{EUAID: "EUAID", JobCodeEASi: true})
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intakes/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakesHandler{
			FetchSystemIntakes: newMockFetchSystemIntakes(models.SystemIntakes{}, nil),
			HandlerBase:        s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("FETCH fails with bad db fetch", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/system_intakes/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakesHandler{
			FetchSystemIntakes: newMockFetchSystemIntakes(models.SystemIntakes{}, fmt.Errorf("failed to save")),
			HandlerBase:        s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Something went wrong", responseErr.Message)
	})
}
