package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

func newMockArchiveSystemIntake(err error) archiveSystemIntake {
	return func(ctx context.Context, id uuid.UUID) error {
		return err
	}
}

func (s *HandlerTestSuite) TestSystemIntakeHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithPrincipal(requestContext, &authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})
	id, err := uuid.NewUUID()
	s.NoError(err)
	s.Run("golden path DELETE passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "DELETE", fmt.Sprintf("/system_intake/%s", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		SystemIntakeHandler{
			HandlerBase:         s.base,
			ArchiveSystemIntake: newMockArchiveSystemIntake(nil),
		}.Handle()(rr, req)
		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("DELETE returns an error if the uuid is not valid", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "DELETE", "/system_intake/NON_EXISTENT", bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": "NON_EXISTENT"})
		SystemIntakeHandler{
			HandlerBase:         s.base,
			ArchiveSystemIntake: newMockArchiveSystemIntake(nil),
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
	})

	s.Run("DELETE returns an error if the uuid doesn't exist", func() {
		nonexistentID := uuid.New()
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "DELETE", "/system_intake/"+nonexistentID.String(), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": nonexistentID.String()})
		SystemIntakeHandler{
			HandlerBase:         s.base,
			ArchiveSystemIntake: newMockArchiveSystemIntake(&apperrors.ResourceNotFoundError{}),
		}.Handle()(rr, req)

		s.Equal(http.StatusNotFound, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Resource not found", responseErr.Message)
	})
}
