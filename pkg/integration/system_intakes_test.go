package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
	"time"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s IntegrationTestSuite) TestSystemIntakeEndpoints() {
	apiURL, err := url.Parse(s.server.URL)
	s.NoError(err, "failed to parse URL")
	apiURL.Path = path.Join(apiURL.Path, "/api/v1")
	systemIntakeURL, err := url.Parse(apiURL.String())
	s.NoError(err, "failed to parse URL")
	systemIntakeURL.Path = path.Join(systemIntakeURL.Path, "/system_intake")

	getURL, err := url.Parse(systemIntakeURL.String())
	s.NoError(err, "failed to parse URL")

	client := &http.Client{}

	systemIntake := models.SystemIntake{
		Requester:   "TEST REQUESTER",
		Status:      models.SystemIntakeStatusINTAKEDRAFT,
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(s.user.euaID),
	}
	createdIntake, _ := s.store.CreateSystemIntake(context.Background(), &systemIntake)
	id := createdIntake.ID

	s.Run("PUT will succeed first time with token", func() {
		body, err := json.Marshal(map[string]string{
			"id":          id.String(),
			"requester":   "TEST REQUESTER",
			"status":      string(models.SystemIntakeStatusINTAKEDRAFT),
			"requestType": string(models.SystemIntakeRequestTypeNEW),
		})
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, systemIntakeURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusOK, resp.StatusCode)
	})

	getURL.Path = path.Join(getURL.Path, id.String())

	s.Run("GET will fetch the intake just saved", func() {
		req, err := http.NewRequest(http.MethodGet, getURL.String(), nil)
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()

		s.Equal(http.StatusOK, resp.StatusCode)
		actualBody, err := ioutil.ReadAll(resp.Body)
		s.NoError(err)
		var actualIntake models.SystemIntake
		err = json.Unmarshal(actualBody, &actualIntake)
		s.NoError(err)
		s.Equal(id, actualIntake.ID)
	})

	s.Run("PUT will succeed second time with with new data", func() {
		body, err := json.Marshal(map[string]string{
			"id":          id.String(),
			"status":      string(models.SystemIntakeStatusINTAKEDRAFT),
			"requestType": string(models.SystemIntakeRequestTypeNEW),
			"requester":   "Test Requester",
		})
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, systemIntakeURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusOK, resp.StatusCode)
	})

	// Since we can't always hit the CEDAR API in the following
	// 2 tests (both for performance and VPN reasons)
	// this test can be run in local environments to make sure CEDAR
	// is set up.
	// Other tests should mock the API
	s.Run("PUT will succeed if status is 'SUBMITTED' and it passes validation", func() {
		if !s.environment.Local() {
			fmt.Println("Skipped 'PUT will succeed if status is 'SUBMITTED' and it passes validation'")
			return
		}
		updatedAt := time.Now().UTC()
		intake := models.SystemIntake{
			ID:                      id,
			EUAUserID:               null.StringFrom("FAKE"),
			Requester:               "Test Requester",
			Component:               null.StringFrom("Test Requester"),
			BusinessOwner:           null.StringFrom("Test Requester"),
			BusinessOwnerComponent:  null.StringFrom("Test Requester"),
			ProductManager:          null.StringFrom("Test Requester"),
			ProductManagerComponent: null.StringFrom("Test Requester"),
			ProjectName:             null.StringFrom("Test Requester"),
			ExistingFunding:         null.BoolFrom(false),
			BusinessNeed:            null.StringFrom("test business need"),
			Solution:                null.StringFrom("Test Requester"),
			ProcessStatus:           null.StringFrom("Test Requester"),
			EASupportRequest:        null.BoolFrom(true),
			ExistingContract:        null.StringFrom("Test Requester"),
			UpdatedAt:               &updatedAt,
			Status:                  models.SystemIntakeStatusINTAKESUBMITTED,
		}
		body, err := json.Marshal(intake)
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, systemIntakeURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusOK, resp.StatusCode)
	})

	s.Run("PUT will fail if status is 'SUBMITTED', but it doesn't pass validation", func() {
		if !s.environment.Local() {
			fmt.Println("Skipped 'PUT will fail if status is 'SUBMITTED' and it doesn't pass validation'")
			return
		}
		body, err := json.Marshal(map[string]string{
			"id":        id.String(),
			"status":    string(models.SystemIntakeStatusINTAKESUBMITTED),
			"requester": "Test Requester",
		})
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, systemIntakeURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusBadRequest, resp.StatusCode)
	})

	s.Run("GET will fetch the updated intake just saved", func() {
		req, err := http.NewRequest(http.MethodGet, getURL.String(), nil)
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()

		s.Equal(http.StatusOK, resp.StatusCode)
		actualBody, err := ioutil.ReadAll(resp.Body)
		s.NoError(err)
		var actualIntake models.SystemIntake
		err = json.Unmarshal(actualBody, &actualIntake)
		s.NoError(err)
		s.Equal(id, actualIntake.ID)
		s.Equal("Test Requester", actualIntake.Requester)
	})
}
