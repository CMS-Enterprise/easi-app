package scheduler

func (suite *SchedulerTestSuite) TestReauthenticateWithOktaJobFunction() {

	testScheduler := suite.NewTestScheduler()

	stubJob := suite.NewScheduledJobStub(testScheduler)

	err := reauthenticateWithOktaJobFunction(suite.testConfigs.Context, stubJob)
	suite.NoError(err)
}
