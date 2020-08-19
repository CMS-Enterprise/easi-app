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

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s IntegrationTestSuite) TestBusinessCaseEndpoints() {
	apiURL, err := url.Parse(s.server.URL)
	s.NoError(err, "failed to parse URL")
	apiURL.Path = path.Join(apiURL.Path, "/api/v1")
	businessCaseURL, err := url.Parse(apiURL.String())
	s.NoError(err, "failed to parse URL")
	businessCaseURL.Path = path.Join(businessCaseURL.Path, "/business_case")

	intake := testhelpers.NewSystemIntake()
	intake.Status = models.SystemIntakeStatusSUBMITTED
	intake.EUAUserID = s.user.euaID

	createdIntake, err := s.store.CreateSystemIntake(context.Background(), &intake)
	intakeID := createdIntake.ID
	s.NoError(err)

	body, err := json.Marshal(map[string]string{
		"systemIntakeId": intakeID.String(),
		"status":         "DRAFT",
	})
	s.NoError(err)

	getURL, err := url.Parse(businessCaseURL.String())
	s.NoError(err, "failed to parse URL")

	//initialize business case id for assignment after creating
	var id uuid.UUID

	client := &http.Client{}

	s.Run("POST will fail with no Authorization", func() {
		req, err := http.NewRequest(http.MethodPost, businessCaseURL.String(), bytes.NewBuffer(body))
		req.Header.Del("Authorization")
		s.NoError(err)
		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusUnauthorized, resp.StatusCode)
	})

	s.Run("POST will succeed with token", func() {
		req, err := http.NewRequest(http.MethodPost, businessCaseURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusCreated, resp.StatusCode)
		actualBody, err := ioutil.ReadAll(resp.Body)
		s.NoError(err)
		var actualBusinessCase models.BusinessCase
		err = json.Unmarshal(actualBody, &actualBusinessCase)
		s.NoError(err)
		s.Equal(intakeID, actualBusinessCase.SystemIntakeID)
		s.Equal(s.user.euaID, actualBusinessCase.EUAUserID)

		id = actualBusinessCase.ID
	})

	s.Run("GET will fail with no Authorization", func() {
		getURL.Path = path.Join(getURL.Path, id.String())
		req, err := http.NewRequest(http.MethodPost, getURL.String(), nil)
		req.Header.Del("Authorization")
		s.NoError(err)
		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusUnauthorized, resp.StatusCode)
	})

	// This needs to be run after the successful post test to ensure we have a business case to fetch
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
		var actualBusinessCase models.BusinessCase
		err = json.Unmarshal(actualBody, &actualBusinessCase)
		s.NoError(err)
		s.Equal(id, actualBusinessCase.ID)
		s.Equal(intakeID, actualBusinessCase.SystemIntakeID)
	})

	// This needs to be run after the successful post test to ensure we have a business case to fetch
	s.Run("UPDATE will fail with no Authorization", func() {
		putURL := getURL
		requester := "Test Requester"
		body, err := json.Marshal(map[string]string{
			"status":    "DRAFT",
			"requester": requester,
		})
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Del("Authorization")
		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusUnauthorized, resp.StatusCode)
	})

	// This needs to be run after the successful post test to ensure we have a business case to fetch
	s.Run("UPDATE will fetch the updated intake just saved", func() {
		putURL := getURL
		requester := "Test Requester"
		body, err := json.Marshal(map[string]string{
			"status":    "DRAFT",
			"requester": requester,
		})
		s.NoError(err)

		req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()

		s.Equal(http.StatusOK, resp.StatusCode)
		actualBody, err := ioutil.ReadAll(resp.Body)
		s.NoError(err)
		var actualBusinessCase models.BusinessCase
		err = json.Unmarshal(actualBody, &actualBusinessCase)
		s.NoError(err)
		s.Equal(id, actualBusinessCase.ID)
		s.Equal(requester, actualBusinessCase.Requester.String)
	})
}
