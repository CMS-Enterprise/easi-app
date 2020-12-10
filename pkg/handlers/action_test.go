package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockCreateAction(err error) createAction {
	return func(ctx context.Context, action *models.Action) error {
		return err
	}
}

func newMockFetchActions(err error) fetchActions {
	return func(ctx context.Context, id uuid.UUID) ([]models.Action, error) {
		if err != nil {
			return nil, err
		}
		return []models.Action{
			{},
			{},
		}, nil
	}
}

func (s HandlerTestSuite) TestSystemIntakeActionHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithPrincipal(requestContext, &authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})
	id, _ := uuid.NewUUID()

	s.Run("golden path POST passes", func() {
		body, err := json.Marshal(map[string]string{
			"actionType": "SUBMIT",
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, reqErr := http.NewRequestWithContext(
			requestContext,
			"POST",
			fmt.Sprintf("/system_intake/%s/actions", id.String()),
			bytes.NewBuffer(body),
		)
		s.NoError(reqErr)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		ActionHandler{
			HandlerBase:  s.base,
			CreateAction: newMockCreateAction(nil),
		}.Handle()(rr, req)

		s.Equal(http.StatusCreated, rr.Code)
	})

	s.Run("POST fails with empty request body", func() {
		rr := httptest.NewRecorder()
		req, reqErr := http.NewRequestWithContext(
			requestContext,
			"POST",
			fmt.Sprintf("/system_intake/%s/actions", id.String()),
			bytes.NewBufferString(""),
		)
		s.NoError(reqErr)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		ActionHandler{
			HandlerBase:  s.base,
			CreateAction: newMockCreateAction(nil),
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
	})

	s.Run("POST fails if a error is thrown by service", func() {
		body, err := json.Marshal(map[string]string{
			"actionType": "SUBMIT",
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(
			requestContext,
			"POST",
			fmt.Sprintf("/system_intake/%s/actions", id.String()),
			bytes.NewBuffer(body),
		)
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		expectedErr := apperrors.ValidationError{
			Model:   models.Action{},
			ModelID: "",
			Err:     fmt.Errorf("failed validations"),
		}
		ActionHandler{
			HandlerBase:  s.base,
			CreateAction: newMockCreateAction(&expectedErr),
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
	})

	s.Run("golden path GET passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", fmt.Sprintf("/system_intake/%s/actions", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		ActionHandler{
			HandlerBase:  s.base,
			FetchActions: newMockFetchActions(nil),
		}.Handle()(rr, req)
		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("GET returns an error if the uuid is not valid", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intake/NON_EXISTENT/actions", bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": "NON_EXISTENT"})
		ActionHandler{
			HandlerBase:  s.base,
			FetchActions: newMockFetchActions(nil),
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
	})

	s.Run("GET returns an error if the service return an error", func() {
		nonexistentID := uuid.New()
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intake/"+nonexistentID.String()+"/actions", bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": nonexistentID.String()})
		ActionHandler{
			HandlerBase:  s.base,
			FetchActions: newMockFetchActions(&apperrors.ResourceNotFoundError{}),
		}.Handle()(rr, req)

		s.Equal(http.StatusNotFound, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Resource not found", responseErr.Message)
	})
}
