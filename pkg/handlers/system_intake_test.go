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

func newMockCreateSystemIntake(requester string, err error) createSystemIntake {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		newIntake := models.SystemIntake{
			ID:        uuid.New(),
			EUAUserID: "FAKE",
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: requester,
		}
		return &newIntake, err
	}
}

func (s HandlerTestSuite) TestSystemIntakeHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithUser(requestContext, models.User{EUAUserID: "FAKE"})
	requester := "Test Requester"
	id, err := uuid.NewUUID()
	s.NoError(err)
	s.Run("golden path GET passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", fmt.Sprintf("/system_intake/%s", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		SystemIntakeHandler{
			SaveSystemIntake:      nil,
			HandlerBase:           s.base,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(nil),
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
			HandlerBase:           s.base,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(fmt.Errorf("failed to parse system intake id to uuid")),
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
			HandlerBase:           s.base,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(fmt.Errorf("failed to fetch system intake")),
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to GET system intake\n", rr.Body.String())
	})

	s.Run("golden path POST passes", func() {
		body, err := json.Marshal(map[string]string{
			"status":    "DRAFT",
			"requester": requester,
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "POST", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, nil),
			SaveSystemIntake:      nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusCreated, rr.Code)
	})

	s.Run("POST fails if there is no eua ID in the context", func() {
		badContext := context.Background()
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"status":    "DRAFT",
			"requester": requester,
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(badContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, nil),
			SaveSystemIntake:      nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)
		s.Equal(http.StatusUnauthorized, rr.Code)
	})

	s.Run("POST fails if a validation error is thrown", func() {
		body, err := json.Marshal(map[string]string{
			"status":    "DRAFT",
			"requester": requester,
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "POST", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErr := apperrors.ValidationError{
			Model:   models.BusinessCase{},
			ModelID: "",
			Err:     fmt.Errorf("failed validations"),
		}
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, &expectedErr),
			SaveSystemIntake:      nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
	})

	s.Run("POST fails if business case isn't created", func() {
		body, err := json.Marshal(map[string]string{
			"status":    "DRAFT",
			"requester": requester,
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "POST", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, fmt.Errorf("failed to create intake")),
			SaveSystemIntake:      nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)
		s.Equal(http.StatusInternalServerError, rr.Code)
	})

	s.Run("golden path PUT passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(nil),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("PUT fails with bad request body", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString(""))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(nil),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
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
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to save system intake\n", rr.Body.String())
	})

	s.Run("PUT fails with already submitted intake", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":         id.String(),
			"status":     "SUBMITTED",
			"alfabet_id": "123-345-19",
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErrMessage := fmt.Errorf("failed to validate")
		expectedErr := &apperrors.ValidationError{Err: expectedErrMessage, Model: models.SystemIntake{}, ModelID: id.String()}
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
		s.Equal("Failed to validate system intake\n", rr.Body.String())
	})

	s.Run("PUT fails with failed validation", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":     id.String(),
			"status": "SUBMITTED",
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErrMessage := fmt.Errorf("failed to validate")
		expectedErr := &apperrors.ValidationError{Err: expectedErrMessage, Model: models.SystemIntake{}, ModelID: id.String()}
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
		s.Equal("Failed to validate system intake\n", rr.Body.String())
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
		expectedErrMessage := fmt.Errorf("failed to submit")
		expectedErr := &apperrors.ExternalAPIError{Err: expectedErrMessage, Model: models.SystemIntake{}, ModelID: id.String(), Operation: apperrors.Submit, Source: "CEDAR"}
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to submit system intake\n", rr.Body.String())
	})

	s.Run("PUT fails with failed email", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":     id.String(),
			"status": "SUBMITTED",
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErrMessage := fmt.Errorf("failed to send notification")
		expectedErr := &apperrors.NotificationError{
			Err:             expectedErrMessage,
			DestinationType: apperrors.DestinationTypeEmail,
		}
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to send notification\n", rr.Body.String())
	})
}
