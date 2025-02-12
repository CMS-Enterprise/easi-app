package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"path"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *IntegrationTestSuite) TestBusinessCaseEndpoints() {
	apiURL, err := url.Parse(s.server.URL)
	s.NoError(err, "failed to parse URL")
	apiURL.Path = path.Join(apiURL.Path, "/api/v1")
	businessCaseURL, err := url.Parse(apiURL.String())
	s.NoError(err, "failed to parse URL")
	businessCaseURL.Path = path.Join(businessCaseURL.Path, "/business_case")

	intake := testhelpers.NewSystemIntake()
	intake.RequestFormState = models.SIRFSSubmitted
	intake.EUAUserID = null.StringFrom(s.user.euaID)

	createdIntake, err := s.store.CreateSystemIntake(context.Background(), &intake)
	s.NoError(err)
	intakeID := createdIntake.ID

	bizCase := testhelpers.NewBusinessCase(intake.ID)
	bizCase.SystemIntakeID = intakeID
	bizCase.EUAUserID = s.user.euaID
	createdBizCase, err := s.store.CreateBusinessCase(context.Background(), &bizCase)

	s.NoError(err)

	getURL, err := url.Parse(businessCaseURL.String())
	s.NoError(err, "failed to parse URL")

	client := &http.Client{}

	s.Run("GET will fail with no Authorization", func() {
		getURL.Path = path.Join(getURL.Path, createdBizCase.ID.String())
		req, err := http.NewRequest(http.MethodPost, getURL.String(), nil)
		req.Header.Del("Authorization")
		s.NoError(err)
		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusUnauthorized, resp.StatusCode)
	})

	// This needs to be run after the successful post test to ensure we have a Business Case to fetch
	s.Run("GET will fetch the updated Business Case just saved", func() {
		req, err := http.NewRequest(http.MethodGet, getURL.String(), nil)
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))
		resp, err := client.Do(req)

		s.NoError(err)
		defer resp.Body.Close()

		s.Equal(http.StatusOK, resp.StatusCode)
		actualBody, err := io.ReadAll(resp.Body)
		s.NoError(err)
		var actualBusinessCase models.BusinessCase
		err = json.Unmarshal(actualBody, &actualBusinessCase)
		s.NoError(err)
		s.Equal(createdBizCase.ID, actualBusinessCase.ID)
		s.Equal(intakeID, actualBusinessCase.SystemIntakeID)
	})

	// This needs to be run after the successful post test to ensure we have a Business Case to fetch
	s.Run("UPDATE will fail with no Authorization", func() {
		putURL := getURL
		requester := "Test Requester"
		body, err := json.Marshal(map[string]string{
			"status":    string(models.BusinessCaseStatusOPEN),
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

	// This needs to be run after the successful post test to ensure we have a Business Case to fetch
	s.Run("UPDATE will fetch the updated Business Case just saved", func() {
		putURL := getURL
		requester := "Test Requester"
		body, err := json.Marshal(map[string]string{
			"status":    string(models.BusinessCaseStatusOPEN),
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
		actualBody, err := io.ReadAll(resp.Body)
		s.NoError(err)
		var actualBusinessCase models.BusinessCase
		err = json.Unmarshal(actualBody, &actualBusinessCase)
		s.NoError(err)
		s.Equal(createdBizCase.ID, actualBusinessCase.ID)
		s.Equal(requester, actualBusinessCase.Requester.String)
	})
}
