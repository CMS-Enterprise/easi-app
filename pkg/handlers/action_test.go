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
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockCreateAction(err error) createAction {
	return func(ctx context.Context, action *models.Action) error {
		return err
	}
}

func (s HandlerTestSuite) TestSystemIntakeActionHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithPrincipal(requestContext, &authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})
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
}
