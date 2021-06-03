package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/guregu/null"
	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockUpdateSystemIntake(err error) updateSystemIntake {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return &models.SystemIntake{}, err
	}
}

func newMockFetchSystemIntakeByID(err error) fetchSystemIntakeByID {
	return func(context context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		intake := models.SystemIntake{
			ID:        id,
			EUAUserID: null.StringFrom("FAKE"),
		}
		return &intake, err
	}
}

func newMockCreateSystemIntake(requester string, err error) createSystemIntake {
	return func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		newIntake := models.SystemIntake{
			ID:        uuid.New(),
			EUAUserID: null.StringFrom("FAKE"),
			Status:    models.SystemIntakeStatusINTAKEDRAFT,
			Requester: requester,
		}
		return &newIntake, err
	}
}

func newMockArchiveSystemIntake(err error) archiveSystemIntake {
	return func(ctx context.Context, id uuid.UUID) error {
		return err
	}
}

func (s HandlerTestSuite) TestSystemIntakeHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithPrincipal(requestContext, &authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})
	requester := "Test Requester"
	id, err := uuid.NewUUID()
	s.NoError(err)
	s.Run("golden path GET passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", fmt.Sprintf("/system_intake/%s", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		SystemIntakeHandler{
			UpdateSystemIntake:    nil,
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
			UpdateSystemIntake:    nil,
			HandlerBase:           s.base,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(nil),
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
	})

	s.Run("GET returns an error if the uuid doesn't exist", func() {
		nonexistentID := uuid.New()
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intake/"+nonexistentID.String(), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": nonexistentID.String()})
		SystemIntakeHandler{
			UpdateSystemIntake:    nil,
			HandlerBase:           s.base,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(&apperrors.ResourceNotFoundError{}),
		}.Handle()(rr, req)

		s.Equal(http.StatusNotFound, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Resource not found", responseErr.Message)
	})

	s.Run("golden path POST passes", func() {
		body, err := json.Marshal(map[string]string{
			"status":    string(models.SystemIntakeStatusINTAKEDRAFT),
			"requester": requester,
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "POST", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, nil),
			UpdateSystemIntake:    nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusCreated, rr.Code)
	})

	s.Run("POST fails if there is no eua ID in the context", func() {
		badContext := context.Background()
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"status":    string(models.SystemIntakeStatusINTAKEDRAFT),
			"requester": requester,
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(badContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, nil),
			UpdateSystemIntake:    nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)
		s.Equal(http.StatusInternalServerError, rr.Code)
	})

	s.Run("POST fails if a validation error is thrown", func() {
		body, err := json.Marshal(map[string]string{
			"status":    string(models.SystemIntakeStatusINTAKEDRAFT),
			"requester": requester,
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "POST", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErr := apperrors.ValidationError{
			Model:   models.SystemIntake{},
			ModelID: "",
			Err:     fmt.Errorf("failed validations"),
		}
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, &expectedErr),
			UpdateSystemIntake:    nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
	})

	s.Run("POST fails if system intake isn't created", func() {
		body, err := json.Marshal(map[string]string{
			"status":    string(models.SystemIntakeStatusINTAKEDRAFT),
			"requester": requester,
		})
		s.NoError(err)
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "POST", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		SystemIntakeHandler{
			HandlerBase:           s.base,
			CreateSystemIntake:    newMockCreateSystemIntake(requester, fmt.Errorf("failed to create intake")),
			UpdateSystemIntake:    nil,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)
		s.Equal(http.StatusInternalServerError, rr.Code)
	})

	s.Run("golden path PUT passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			UpdateSystemIntake:    newMockUpdateSystemIntake(nil),
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
			UpdateSystemIntake:    newMockUpdateSystemIntake(nil),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Bad request", responseErr.Message)
	})

	s.Run("PUT fails with bad save", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			UpdateSystemIntake:    newMockUpdateSystemIntake(fmt.Errorf("failed to save")),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Something went wrong", responseErr.Message)
	})

	s.Run("PUT fails with already submitted intake", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":         id.String(),
			"status":     string(models.SystemIntakeStatusINTAKESUBMITTED),
			"alfabet_id": "123-345-19",
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErrMessage := fmt.Errorf("failed to validate")
		expectedErr := &apperrors.ValidationError{Err: expectedErrMessage, Model: models.SystemIntake{}, ModelID: id.String()}
		SystemIntakeHandler{
			UpdateSystemIntake:    newMockUpdateSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Entity unprocessable", responseErr.Message)
	})

	s.Run("PUT fails with failed validation", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":     id.String(),
			"status": string(models.SystemIntakeStatusINTAKESUBMITTED),
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErrMessage := fmt.Errorf("failed to validate")
		expectedErr := &apperrors.ValidationError{Err: expectedErrMessage, Model: models.SystemIntake{}, ModelID: id.String()}
		SystemIntakeHandler{
			UpdateSystemIntake:    newMockUpdateSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusUnprocessableEntity, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Entity unprocessable", responseErr.Message)
	})

	s.Run("PUT fails with failed submit", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":     id.String(),
			"status": string(models.SystemIntakeStatusINTAKESUBMITTED),
		})
		s.NoError(err)
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBuffer(body))
		s.NoError(err)
		expectedErrMessage := fmt.Errorf("failed to submit")
		expectedErr := &apperrors.ExternalAPIError{Err: expectedErrMessage, Model: models.SystemIntake{}, ModelID: id.String(), Operation: apperrors.Submit, Source: "CEDAR"}
		SystemIntakeHandler{
			UpdateSystemIntake:    newMockUpdateSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusServiceUnavailable, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Service unavailable", responseErr.Message)
	})

	s.Run("PUT fails with failed email", func() {
		rr := httptest.NewRecorder()
		body, err := json.Marshal(map[string]string{
			"id":     id.String(),
			"status": string(models.SystemIntakeStatusINTAKESUBMITTED),
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
			UpdateSystemIntake:    newMockUpdateSystemIntake(expectedErr),
			HandlerBase:           s.base,
			FetchSystemIntakeByID: nil,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Failed to send notification", responseErr.Message)
	})

	s.Run("golden path DELETE passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "DELETE", fmt.Sprintf("/system_intake/%s", id.String()), bytes.NewBufferString(""))
		s.NoError(err)
		req = mux.SetURLVars(req, map[string]string{"intake_id": id.String()})
		SystemIntakeHandler{
			UpdateSystemIntake:  nil,
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
			UpdateSystemIntake:  nil,
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
			UpdateSystemIntake:  nil,
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
