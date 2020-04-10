package integration

import (
	"net/http"
	"net/url"
	"path"
)

func (s *IntegrationTestSuite) TestCatchAllRoute() {
	client := &http.Client{}

	apiURL, err := url.Parse(s.server.URL)
	s.NoError(err, "failed to parse URL")

	s.Run("get /", func() {
		notPath, err := url.Parse(apiURL.String())
		s.NoError(err, "failed to parse URL")
		notPath.Path = path.Join(notPath.Path, "/notapath")
		req, err := http.NewRequest("GET", notPath.String(), nil)
		s.NoError(err)

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusNotFound, resp.StatusCode)
	})

	s.Run("get /api/v1/notapath", func() {
		apiURL.Path = path.Join(apiURL.Path, "/api/v1")
		notPath, err := url.Parse(apiURL.String())
		s.NoError(err, "failed to parse URL")
		notPath.Path = path.Join(notPath.Path, "/notapath")
		req, err := http.NewRequest("GET", notPath.String(), nil)
		s.NoError(err)

		resp, err := client.Do(req)

		s.NoError(err)
		s.Equal(http.StatusNotFound, resp.StatusCode)
	})
}
