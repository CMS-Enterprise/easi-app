package handlers

import (
	"bytes"
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

func newMockCreateSystemIntakeAction(err error) createSystemIntakeAction {
	return func(ctx context.Context, id uuid.UUID, actionType models.ActionType) error {
		return err
	}
}

func (s HandlerTestSuite) TestSystemIntakeActionHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithPrincipal(requestContext, &authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})
	id, err := uuid.NewUUID()
	s.NoError(err)

	s.Run("golden path POST passes", func() {
		rr := httptest.NewRecorder()
		req, reqErr := http.NewRequestWithContext(
			requestContext,
			"POST",
			fmt.Sprintf("/system_intake/%s/action/SUBMIT", id.String()),
			bytes.NewBufferString(""),
		)
		s.NoError(reqErr)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String(), "action_type": "SUBMIT"})
		SystemIntakeActionHandler{
			HandlerBase:              s.base,
			CreateSystemIntakeAction: newMockCreateSystemIntakeAction(nil),
		}.Handle()(rr, req)

		s.Equal(http.StatusCreated, rr.Code)
	})

	s.Run("POST fails if a error is thrown by service", func() {
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(
			requestContext,
			"POST",
			fmt.Sprintf("/system_intake/%s/action/SUBMIT", id.String()),
			bytes.NewBufferString(""),
		)
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String(), "action_type": "SUBMIT"})
		expectedErr := apperrors.ValidationError{
			Model:   models.Action{},
			ModelID: "",
			Err:     fmt.Errorf("failed validations"),
		}
		SystemIntakeActionHandler{
			HandlerBase:              s.base,
			CreateSystemIntakeAction: newMockCreateSystemIntakeAction(&expectedErr),
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
	})
}
