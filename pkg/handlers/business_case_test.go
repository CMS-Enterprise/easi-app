package handlers

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockFetchBusinessCaseByID(err error) func(id uuid.UUID) (*models.BusinessCase, error) {
	return func(id uuid.UUID) (*models.BusinessCase, error) {
		businessCase := models.BusinessCase{
			ID:        id,
			EUAUserID: "FAKE",
		}
		return &businessCase, err
	}
}

func (s HandlerTestSuite) TestBusinessCaseHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithEuaID(requestContext, "FAKE")
	id, err := uuid.NewUUID()
	s.NoError(err)
	s.Run("golden path GET passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", fmt.Sprintf("/business_case/%s", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"business_case_id": id.String()})
		BusinessCaseHandler{
			Logger:                s.logger,
			FetchBusinessCaseByID: newMockFetchBusinessCaseByID(nil),
		}.Handle()(rr, req)
		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("GET returns an error if the uuid is not valid", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/business_case/NON_EXISTENT", bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"business_case_id": "NON_EXISTENT"})
		BusinessCaseHandler{
			Logger:                s.logger,
			FetchBusinessCaseByID: newMockFetchBusinessCaseByID(fmt.Errorf("failed to parse business case id to uuid")),
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
	})

	s.Run("GET returns an error if the uuid doesn't exist", func() {
		nonexistentID := uuid.New()
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/business_case/"+nonexistentID.String(), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"business_case_id": nonexistentID.String()})
		BusinessCaseHandler{
			Logger:                s.logger,
			FetchBusinessCaseByID: newMockFetchBusinessCaseByID(fmt.Errorf("failed to fetch business case")),
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to GET business case\n", rr.Body.String())
	})
}
