package okta

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type OktaTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestOktaTestSuite(t *testing.T) {
	// TODO: replace `os` with another package for handling env
	testSuite := &OktaTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}

func (s OktaTestSuite) TestAuthorizeMiddleware() {
	accessToken, err := testhelpers.OktaAccessToken()
	s.NoError(err, "couldn't get access token")
	s.NotEmpty(accessToken, "empty access token")
}
