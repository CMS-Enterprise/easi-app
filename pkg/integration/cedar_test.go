package integration

import (
	"context"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/cedar/cedareasi"
)

// Since we can't always hit the CEDAR API in tests
// (both for performance and VPN reasons)
// this test can be run in local environments to make sure CEDAR
// is set up.
// Other tests should mock the API
func (s *IntegrationTestSuite) TestCEDARConnection() {
	if !s.environment.Local() {
		s.T().Skip("Skipped 'TestCEDARConnection' test")
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	cedarEasiClient := cedareasi.NewTranslatedClient(
		s.config.GetString("CEDAR_API_URL"),
		s.config.GetString("CEDAR_API_KEY"),
		ldClient,
	)

	ctx, cxl := context.WithTimeout(context.Background(), time.Second*2)
	defer cxl()

	start := time.Now()

	err = cedarEasiClient.CheckConnection(ctx)

	s.Less(int64(time.Now().Sub(start)), int64(time.Second*3))
	s.NoError(err)
}
