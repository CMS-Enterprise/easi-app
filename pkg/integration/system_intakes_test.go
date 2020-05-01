package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s IntegrationTestSuite) TestSystemIntakeEndpoints() {
	apiURL, err := url.Parse(s.server.URL)
	s.NoError(err, "failed to parse URL")
	apiURL.Path = path.Join(apiURL.Path, "/api/v1")
	putURL, err := url.Parse(apiURL.String())
	s.NoError(err, "failed to parse URL")
	putURL.Path = path.Join(putURL.Path, "/system_intake")

	id, _ := uuid.NewUUID()
	body, err := json.Marshal(map[string]string{
		"id":     id.String(),
		"status": "DRAFT",
	})
	s.NoError(err)

	getURL, err := url.Parse(putURL.String())
	s.NoError(err, "failed to parse URL")
	getURL.Path = path.Join(getURL.Path, id.String())

	client := &http.Client{}

	s.Run("PUT will fail with no Authorization", func() {
		req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusUnauthorized, resp.StatusCode)
	})

	s.Run("PUT will succeed first time with token", func() {
		req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusOK, resp.StatusCode)
	})

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
			"id":        id.String(),
			"status":    "DRAFT",
			"requester": "Test Requester",
		})
		s.NoError(err)
		req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
		s.NoError(err)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusOK, resp.StatusCode)
	})

	// TODO uncomment when we have CircleCI configured to hit CEDAR
	//s.Run("PUT will succeed if status is 'SUBMITTED' and it passes validation", func() {
	//	updatedAt := time.Now().UTC()
	//	intake := models.SystemIntake{
	//		ID:                      id,
	//		EUAUserID:               "FAKE",
	//		Requester:               null.StringFrom("Test Requester"),
	//		Component:               null.StringFrom("Test Requester"),
	//		BusinessOwner:           null.StringFrom("Test Requester"),
	//		BusinessOwnerComponent:  null.StringFrom("Test Requester"),
	//		ProductManager:          null.StringFrom("Test Requester"),
	//		ProductManagerComponent: null.StringFrom("Test Requester"),
	//		ProjectName:             null.StringFrom("Test Requester"),
	//		ExistingFunding:         null.BoolFrom(false),
	//		BusinessNeed:            null.StringFrom("test business need"),
	//		Solution:                null.StringFrom("Test Requester"),
	//		ProcessStatus:           null.StringFrom("Test Requester"),
	//		EASupportRequest:        null.BoolFrom(true),
	//		ExistingContract:        null.StringFrom("Test Requester"),
	//		UpdatedAt:               &updatedAt,
	//		Status:                  models.SystemIntakeStatusSUBMITTED,
	//	}
	//	body, err := json.Marshal(intake)
	//	s.NoError(err)
	//	req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
	//	s.NoError(err)
	//	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))
	//
	//	resp, err := client.Do(req)
	//
	//	s.NoError(err)
	//	s.Equal(http.StatusOK, resp.StatusCode)
	//})
	//
	// TODO uncomment when we have CircleCI configured to hit CEDAR
	//s.Run("PUT will fail if status is 'SUBMITTED', but it doesn't pass validation", func() {
	//	body, err := json.Marshal(map[string]string{
	//		"id":        id.String(),
	//		"status":    "SUBMITTED",
	//		"requester": "Test Requester",
	//	})
	//	s.NoError(err)
	//	req, err := http.NewRequest(http.MethodPut, putURL.String(), bytes.NewBuffer(body))
	//	s.NoError(err)
	//	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.user.accessToken))
	//
	//	resp, err := client.Do(req)
	//
	//	s.NoError(err)
	//	s.Equal(http.StatusBadRequest, resp.StatusCode)
	//})

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
		s.Equal("Test Requester", actualIntake.Requester.String)
	})
}
