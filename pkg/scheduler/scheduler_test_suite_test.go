package scheduler

import (
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/testconfig"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/cedartestconfigs"
	"github.com/cms-enterprise/easi-app/pkg/testconfig/dataloadertestconfigs"
	useraccounthelperstestconfigs "github.com/cms-enterprise/easi-app/pkg/testconfig/useraccountstoretestconfigs"
)

// SchedulerTestSuite is the testify suite for the translated audit package
type SchedulerTestSuite struct {
	suite.Suite
	*require.Assertions // included so that calls to things like ResolverSuite.NoError or ResolverSuite.Equal() use the "require" version instead of "assert"
	testConfigs         *testconfig.Base
}

// SetupTest clears the database between each test
func (suite *SchedulerTestSuite) SetupTest() {
	// We need to set the *require.Assertions here, as we need to have already called suite.Run() to ensure the
	// test suite has been constructed before we call suite.Require()
	suite.Assertions = suite.Require()

	err := suite.testConfigs.GenericSetupTests()
	suite.NoError(err)
	suite.testConfigs.Context = dataloadertestconfigs.DecorateTestContextWithDataLoader(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.StubFetchUserInfos, cedartestconfigs.StubGetCedarSystems)

	//TODO: verify if anything else is needed for this test suite
}

func (suite *SchedulerTestSuite) buildDataLoaders() dataloaders.BuildDataloaders {
	return dataloadertestconfigs.BuildDataLoaders(suite.testConfigs.Store, suite.testConfigs.StubFetchUserInfos, cedartestconfigs.StubGetCedarSystems)
}

// TestSchedulerSuite runs the test suite
func TestSchedulerSuite(t *testing.T) {
	sts := new(SchedulerTestSuite)
	sts.testConfigs = testconfig.GetDefaultTestConfigs(useraccounthelperstestconfigs.GetTestPrincipal)
	suite.Run(t, sts)
}
