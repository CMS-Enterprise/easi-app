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
	"time"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func (s *IntegrationTestSuite) TestSystemIntakeEndpoints() {
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
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(s.user.euaID),
	}
	createdIntake, _ := storage.CreateSystemIntake(context.Background(), s.store, &systemIntake)
	id := createdIntake.ID

	s.Run("PUT will succeed first time with token", func() {
		intakeToUpdate, err := s.store.FetchSystemIntakeByID(context.Background(), id)
		s.NoError(err)
		body, err := json.Marshal(intakeToUpdate)
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
		actualBody, err := io.ReadAll(resp.Body)
		s.NoError(err)
		var actualIntake models.SystemIntake
		err = json.Unmarshal(actualBody, &actualIntake)
		s.NoError(err)
		s.Equal(id, actualIntake.ID)
	})

	s.Run("PUT will succeed second time with with new data", func() {
		intakeToUpdate, err := s.store.FetchSystemIntakeByID(context.Background(), id)
		s.NoError(err)
		intakeToUpdate.Requester = "Test Requester"
		body, err := json.Marshal(intakeToUpdate)
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
		intakeToUpdate, err := s.store.FetchSystemIntakeByID(context.Background(), id)
		s.NoError(err)
		intakeToUpdate.ID = id
		intakeToUpdate.EUAUserID = null.StringFrom("FAKE")
		intakeToUpdate.Requester = "Test Requester"
		intakeToUpdate.Component = null.StringFrom("Test Requester")
		intakeToUpdate.BusinessOwner = null.StringFrom("Test Requester")
		intakeToUpdate.BusinessOwnerComponent = null.StringFrom("Test Requester")
		intakeToUpdate.ProductManager = null.StringFrom("Test Requester")
		intakeToUpdate.ProductManagerComponent = null.StringFrom("Test Requester")
		intakeToUpdate.ProjectName = null.StringFrom("Test Requester")
		intakeToUpdate.ExistingFunding = null.BoolFrom(false)
		intakeToUpdate.BusinessNeed = null.StringFrom("test business need")
		intakeToUpdate.Solution = null.StringFrom("Test Requester")
		intakeToUpdate.ProcessStatus = null.StringFrom("Test Requester")
		intakeToUpdate.EASupportRequest = null.BoolFrom(true)
		intakeToUpdate.ExistingContract = null.StringFrom("Test Requester")
		*intakeToUpdate.UpdatedAt = time.Now().UTC()
		intakeToUpdate.HasUIChanges = null.BoolFrom(false)
		intakeToUpdate.UsesAITech = null.BoolFrom(true)
		body, err := json.Marshal(intakeToUpdate)
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
			fmt.Println("Skipped 'PUT will fail if status is 'SUBMITTED', but it doesn't pass validation'")
			return
		}
		intakeToUpdate, err := s.store.FetchSystemIntakeByID(context.Background(), id)
		s.NoError(err)
		intakeToUpdate.Requester = "Test Requester"
		body, err := json.Marshal(intakeToUpdate)
		s.NoError(err)
		var intakeWithWrongInfo map[string]interface{}
		err = json.Unmarshal(body, &intakeWithWrongInfo)
		s.NoError(err)
		intakeWithWrongInfo["component"] = false
		body, err = json.Marshal(intakeWithWrongInfo)
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
		actualBody, err := io.ReadAll(resp.Body)
		s.NoError(err)
		var actualIntake models.SystemIntake
		err = json.Unmarshal(actualBody, &actualIntake)
		s.NoError(err)
		s.Equal(id, actualIntake.ID)
		s.Equal("Test Requester", actualIntake.Requester)
	})
}
