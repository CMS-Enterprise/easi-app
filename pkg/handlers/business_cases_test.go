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

func newMockFetchBusinessCases(businessCases models.BusinessCases, err error) fetchBusinessCases {
	return func(euaID string) (models.BusinessCases, error) {
		return businessCases, err
	}
}

func (s HandlerTestSuite) TestBusinessCasesHandler() {
	s.Run("golden path FETCH passes", func() {
		rr := httptest.NewRecorder()
		requestContext := context.Background()
		requestContext = appcontext.WithEuaID(requestContext, "EUAID")
		req, err := http.NewRequestWithContext(requestContext, "GET", "/business_cases/", bytes.NewBufferString("{}"))
		s.NoError(err)
		BusinessCasesHandler{
			FetchBusinessCases: newMockFetchBusinessCases(models.BusinessCases{}, nil),
			Logger:             s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("FETCH fails with bad db fetch", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/business_cases/", bytes.NewBufferString("{}"))
		s.NoError(err)
		BusinessCasesHandler{
			FetchBusinessCases: newMockFetchBusinessCases(models.BusinessCases{}, fmt.Errorf("failed to save")),
			Logger:             s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to fetch business cases\n", rr.Body.String())
	})
}
