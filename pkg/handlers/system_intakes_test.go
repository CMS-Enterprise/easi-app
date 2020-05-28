package handlers

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"

	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockFetchSystemIntakes(systemIntakes models.SystemIntakes, err error) fetchSystemIntakes {
	return func(euaID string) (models.SystemIntakes, error) {
		return systemIntakes, err
	}
}

func (s HandlerTestSuite) TestSystemIntakesHandler() {
	s.Run("golden path FETCH passes", func() {
		rr := httptest.NewRecorder()
		requestContext := context.Background()
		requestContext = appcontext.WithUser(requestContext, models.User{EUAUserID: "EUAID"})
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intakes/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakesHandler{
			FetchSystemIntakes: newMockFetchSystemIntakes(models.SystemIntakes{}, nil),
			Logger:             s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("FETCH fails with bad db fetch", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/system_intakes/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakesHandler{
			FetchSystemIntakes: newMockFetchSystemIntakes(models.SystemIntakes{}, fmt.Errorf("failed to save")),
			Logger:             s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to fetch System Intakes\n", rr.Body.String())
	})
}
