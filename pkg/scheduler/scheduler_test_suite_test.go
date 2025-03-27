package scheduler

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/easi-app/pkg/testconfig"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/cedartestconfigs"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/dataloadertestconfigs"
	useraccounthelperstestconfigs "github.com/cms-enterprise/easi-app/pkg/testconfig/useraccountstoretestconfigs"
)

// SchedulerTestSuite is the testify suite for the translated audit package
type SchedulerTestSuite struct {
	suite.Suite
	testConfigs *testconfig.Base
}

// SetupTest clears the database between each test
func (suite *SchedulerTestSuite) SetupTest() {
	err := suite.testConfigs.GenericSetupTests()
	suite.testConfigs.Context = dataloadertestconfigs.DecorateTestContextWithDataLoader(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.StubFetchUserInfos, cedartestconfigs.StubGetCedarSystems)
	suite.NoError(err)
	//TODO: verify if anything else is needed for this test suite
}

// TestSchedulerSuite runs the test suite
func TestSchedulerSuite(t *testing.T) {
	sts := new(SchedulerTestSuite)
	sts.testConfigs = testconfig.GetDefaultTestConfigs(useraccounthelperstestconfigs.GetTestPrincipal)
	suite.Run(t, sts)
}
