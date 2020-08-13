package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockFetchBusinessCases(businessCases models.BusinessCases, err error) fetchBusinessCases {
	return func(ctx context.Context, euaID string) (models.BusinessCases, error) {
		return businessCases, err
	}
}

func (s HandlerTestSuite) TestBusinessCasesHandler() {
	s.Run("golden path FETCH passes", func() {
		rr := httptest.NewRecorder()
		requestContext := context.Background()
		requestContext = appcontext.WithPrincipal(requestContext, &authn.EUAPrincipal{EUAID: "EUAID", JobCodeEASi: true})
		req, err := http.NewRequestWithContext(requestContext, "GET", "/business_cases/", bytes.NewBufferString("{}"))
		s.NoError(err)
		BusinessCasesHandler{
			FetchBusinessCases: newMockFetchBusinessCases(models.BusinessCases{}, nil),
			HandlerBase:        s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("FETCH fails with bad db fetch", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/business_cases/", bytes.NewBufferString("{}"))
		s.NoError(err)
		BusinessCasesHandler{
			FetchBusinessCases: newMockFetchBusinessCases(models.BusinessCases{}, fmt.Errorf("failed to save")),
			HandlerBase:        s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Something went wrong", responseErr.Message)
	})
}
