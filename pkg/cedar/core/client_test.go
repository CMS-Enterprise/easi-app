package cedarcore

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	apiroles "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/role"
	apimodels "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/models"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return f(r)
}

type ClientTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestClientTestSuite(t *testing.T) {
	tests := &ClientTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewExample(),
	}
	suite.Run(t, tests)
}

func (s *ClientTestSuite) TestClient() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	s.Run("Instantiation successful", func() {
		c := NewClient(ctx, "fake", "fake", "1.0.0", true)
		s.NotNil(c)
	})
}

func (s *ClientTestSuite) TestRoleAddRequestScheme() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	for _, tc := range []struct {
		name       string
		schemes    []string
		wantScheme string
	}{
		{name: "defaults to HTTPS", wantScheme: "https"},
		{name: "allows HTTP for test servers", schemes: []string{"http"}, wantScheme: "http"},
	} {
		s.Run(tc.name, func() {
			client := NewClient(ctx, "cedar.example", "fake", "1.0.0", false, tc.schemes...)
			var gotMethod, gotScheme, gotPath, gotBody string
			client.hc.Transport = roundTripFunc(func(r *http.Request) (*http.Response, error) {
				gotMethod = r.Method
				gotScheme = r.URL.Scheme
				gotPath = r.URL.Path
				body, err := io.ReadAll(r.Body)
				if err != nil {
					return nil, err
				}
				gotBody = string(body)
				return &http.Response{
					StatusCode: http.StatusOK,
					Header:     http.Header{"Content-Type": []string{"application/json"}},
					Body:       io.NopCloser(strings.NewReader(`{"result":"success"}`)),
					Request:    r,
				}, nil
			})

			application, objectID, roleTypeID := "alfabet", "system-version-id", "role-type-id"
			params := apiroles.NewRoleAddParams()
			params.HTTPClient = client.hc
			params.SetRoleAddRequest(&apimodels.RoleAddRequest{
				Application: &application,
				Roles: []*apimodels.Role{{
					Application:      &application,
					ObjectID:         &objectID,
					RoleTypeID:       &roleTypeID,
					AssigneeUserName: "ABCD",
				}},
			})

			_, err := client.sdk.Role.RoleAdd(params, client.auth)
			s.Require().NoError(err)
			s.Equal(http.MethodPost, gotMethod)
			s.Equal(tc.wantScheme, gotScheme)
			s.Equal("/gateway/CEDAR Core API/1.0.0/role", gotPath)
			s.Contains(gotBody, `"application":"alfabet"`)
		})
	}
}
