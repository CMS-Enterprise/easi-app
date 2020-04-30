package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockSaveSystemIntake(err error) saveSystemIntake {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		return err
	}
}

func newMockFetchSystemIntakeByID(err error) func(id uuid.UUID) (*models.SystemIntake, error) {
	return func(id uuid.UUID) (*models.SystemIntake, error) {
		intake := models.SystemIntake{
			ID:        id,
			EUAUserID: "FAKE",
		}
		return &intake, err
	}
}

func newMockSubmitSystemIntake(err error) submitSystemIntake {
	return func(intake *models.SystemIntake, logger *zap.Logger) error {
		return err
	}
}

func (s HandlerTestSuite) TestSystemIntakeHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithEuaID(requestContext, "FAKE")
	id, err := uuid.NewUUID()
	s.NoError(err)
	s.Run("golden path GET passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", fmt.Sprintf("/system_intake/%s", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		SystemIntakeHandler{
			SaveSystemIntake:      nil,
			Logger:                s.logger,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(nil),
			SubmitSystemIntake:    nil,
		}.Handle()(rr, req)
		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("GET returns an error if the uuid is not valid", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intake/NON_EXISTENT", bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": "NON_EXISTENT"})
		SystemIntakeHandler{
			SaveSystemIntake:      nil,
			Logger:                s.logger,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(fmt.Errorf("failed to parse system intake id to uuid")),
			SubmitSystemIntake:    nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
	})

	s.Run("GET returns an error if the uuid doesn't exist", func() {
		nonexistentID := uuid.New()
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intake/"+nonexistentID.String(), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": nonexistentID.String()})
		SystemIntakeHandler{
			SaveSystemIntake:      nil,
			Logger:                s.logger,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(fmt.Errorf("failed to fetch system intake")),
			SubmitSystemIntake:    nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to GET system intake\n", rr.Body.String())
	})

	s.Run("golden path PUT passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(nil),
			Logger:                s.logger,
			FetchSystemIntakeByID: nil,
			SubmitSystemIntake:    nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("PUT fails with bad request body", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString(""))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(nil),
			Logger:                s.logger,
			FetchSystemIntakeByID: nil,
			SubmitSystemIntake:    nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
		s.Equal("Bad system intake request\n", rr.Body.String())
	})

	s.Run("PUT fails with bad save", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(fmt.Errorf("failed to save")),
			Logger:                s.logger,
			FetchSystemIntakeByID: nil,
			SubmitSystemIntake:    nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to save system intake\n", rr.Body.String())
	})

	s.Run("PUT fails with failed submit", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":     id.String(),
			"status": "SUBMITTED",
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      nil,
			Logger:                s.logger,
			FetchSystemIntakeByID: nil,
			SubmitSystemIntake:    newMockSubmitSystemIntake(fmt.Errorf("failed to submit system intake")),
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to submit system intake\n", rr.Body.String())
	})
}
