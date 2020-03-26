package handlers

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockSaveSystemIntake(err error) saveSystemIntake {
	return func(ctx context.Context, intake *models.SystemIntake) error {
		return err
	}
}

func newMockFetchSystemIntakeByID(err error) fetchSystemIntakeByID {
	intakeID, _ := uuid.Parse("f92306b9-8a08-4140-854f-5ab89917cec2")
	intake := models.SystemIntake{
		ID:        intakeID,
		EUAUserID: "EUAID",
	}
	return func(id uuid.UUID) (*models.SystemIntake, error) {
		return &intake, err
	}
}

func (s HandlerTestSuite) TestSystemIntakeHandler() {
	requestContext := context.Background()
	requestContext = appcontext.WithEuaID(requestContext, "EUAID")

	s.Run("golden path GET passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "GET", getURL, bytes.NewBufferString(""))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake:      newMockSaveSystemIntake(nil),
			Logger:                s.logger,
			FetchSystemIntakeByID: newMockFetchSystemIntakeByID(nil),
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
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to save system intake\n", rr.Body.String())
	})
}
