package handlers

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"

	"golang.org/x/net/context"

	context2 "github.com/cmsgov/easi-app/pkg/context"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockSaveSystemIntake(err error) saveSystemIntake {
	return func(intake *models.SystemIntake) error {
		return err
	}
}

func (s HandlerTestSuite) TestSystemIntakeHandler() {
	requestContext := context.Background()
	requestContext = context2.WithEuaID(requestContext, "EUAID")

	s.Run("golden path PUT passes", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake: newMockSaveSystemIntake(nil),
			Logger:           s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("PUT fails with bad request body", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString(""))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake: newMockSaveSystemIntake(nil),
			Logger:           s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusBadRequest, rr.Code)
		s.Equal("Bad system intake request\n", rr.Body.String())
	})

	s.Run("PUT fails with bad save", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequestWithContext(requestContext, "PUT", "/system_intake/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakeHandler{
			SaveSystemIntake: newMockSaveSystemIntake(fmt.Errorf("failed to save")),
			Logger:           s.logger,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		s.Equal("Failed to save system intake\n", rr.Body.String())
	})
}
