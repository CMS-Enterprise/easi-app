package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
)

func newMockFetchSystemIntakes(systemIntakes models.SystemIntakes, err error) fetchSystemIntakes {
	return func(context context.Context, filter models.SystemIntakeStatusFilter) (models.SystemIntakes, error) {
		return systemIntakes, err
	}
}

func (s HandlerTestSuite) TestSystemIntakesHandler() {
	s.Run("golden path FETCH passes", func() {
		rr := httptest.NewRecorder()
		requestContext := context.Background()
		requestContext = appcontext.WithPrincipal(requestContext, &authn.EUAPrincipal{EUAID: "EUAID", JobCodeEASi: true})
		req, err := http.NewRequestWithContext(requestContext, "GET", "/system_intakes/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakesHandler{
			FetchSystemIntakes: newMockFetchSystemIntakes(models.SystemIntakes{}, nil),
			HandlerBase:        s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)
	})

	s.Run("FETCH fails with bad db fetch", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/system_intakes/", bytes.NewBufferString("{}"))
		s.NoError(err)
		SystemIntakesHandler{
			FetchSystemIntakes: newMockFetchSystemIntakes(models.SystemIntakes{}, fmt.Errorf("failed to save")),
			HandlerBase:        s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
		responseErr := errorResponse{}
		err = json.Unmarshal(rr.Body.Bytes(), &responseErr)
		s.NoError(err)
		s.Equal("Something went wrong", responseErr.Message)
	})
}

func (s HandlerTestSuite) TestLCIDHandler() {

	testCases := map[string]struct {
		verb     string
		intakeID string
		body     string
		status   int
	}{
		"happy path assign": {
			verb:     "POST",
			intakeID: uuid.New().String(),
			body: `{
				"lcid": "123456",
				"lcidExpiresAt": "2021-09-10",
				"lcidNextSteps": "fuhgeddaboutit",
				"lcidScope": "telescope"
			}`,
			status: http.StatusCreated,
		},
		"happy path generate": {
			verb:     "POST",
			intakeID: uuid.New().String(),
			body: `{
				"lcidExpiresAt": "2021-09-10",
				"lcidNextSteps": "fuhgeddaboutit",
				"lcidScope": "telescope"
			}`,
			status: http.StatusCreated,
		},
		"write error": {
			verb:     "POST",
			intakeID: uuid.Nil.String(),
			body: `{
				"lcidExpiresAt": "2021-09-10",
				"lcidNextSteps": "fuhgeddaboutit",
				"lcidScope": "telescope"
			}`,
			status: http.StatusInternalServerError,
		},
		"missing scope": {
			verb:     "POST",
			intakeID: uuid.New().String(),
			body: `{
				"lcidExpiresAt": "2021-09-10",
				"lcidNextSteps": "fuhgeddaboutit"
			}`,
			status: http.StatusUnprocessableEntity,
		},
		"missing next steps": {
			verb:     "POST",
			intakeID: uuid.New().String(),
			body: `{
				"lcidExpiresAt": "2021-09-10",
				"lcidScope": "telescope"
			}`,
			status: http.StatusUnprocessableEntity,
		},
		"missing expires": {
			verb:     "POST",
			intakeID: uuid.New().String(),
			body: `{
				"lcidNextSteps": "fuhgeddaboutit",
				"lcidScope": "telescope"
			}`,
			status: http.StatusUnprocessableEntity,
		},
		"cannot parse date": {
			verb:     "POST",
			intakeID: uuid.New().String(),
			body: `{
				"lcidExpiresAt": "ooga-wakka",
				"lcidNextSteps": "fuhgeddaboutit",
				"lcidScope": "telescope"
			}`,
			status: http.StatusUnprocessableEntity,
		},
	}

	fnLCID := func(c context.Context, i *models.SystemIntake) (*models.SystemIntake, error) {
		if i.ID == uuid.Nil {
			return nil, errors.New("forced error")
		}
		return nil, nil
	}
	var handler http.Handler = NewSystemIntakeLifecycleIDHandler(s.base, fnLCID).Handle()

	for name, tc := range testCases {
		s.Run(name, func() {
			rr := httptest.NewRecorder()
			req, err := http.NewRequest(tc.verb, "/system_intake/{intake_id}/lcid", bytes.NewBufferString(tc.body))
			s.NoError(err)
			req = mux.SetURLVars(req, map[string]string{
				"intake_id": tc.intakeID,
			})
			handler.ServeHTTP(rr, req)

			s.Equal(tc.status, rr.Code)
		})
	}
}
