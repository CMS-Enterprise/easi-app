package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

func (s IntegrationTestSuite) TestSystemIntakeEndpoints() {
	path := "/api/v1/system_intake"
	id, _ := uuid.NewUUID()
	body, err := json.Marshal(map[string]string{
		"id": id.String(),
	})
	s.NoError(err)
	client := &http.Client{}

	s.Run("PUT will fail with no Authorization", func() {
		req, err := http.NewRequest(http.MethodPut, s.server.URL+path, bytes.NewBuffer(body))
		s.NoError(err)
		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()
		s.Equal(http.StatusUnauthorized, resp.StatusCode)
	})

	s.Run("PUT will succeed first time with token", func() {
		req, err := http.NewRequest(http.MethodPut, s.server.URL+path, bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusOK, resp.StatusCode)
	})

	s.Run("GET will fetch the intake just saved", func() {
		req, err := http.NewRequest(http.MethodGet, s.server.URL+path+id.String(), nil)
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()

		s.Equal(resp.StatusCode, http.StatusOK)
	})

	s.Run("PUT will succeed second time with with new data", func() {
		body, err := json.Marshal(map[string]string{
			"id":        id.String(),
			"requester": "Test Requester",
		})
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, s.server.URL+path, bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()
		s.Equal(resp.StatusCode, http.StatusOK)
	})

	// TODO: hit GET endpoint here and check data is updated
}
