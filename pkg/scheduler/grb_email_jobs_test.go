package scheduler

func (suite *SchedulerTestSuite) TestSendAsyncVotingHalfwayThroughEmailJobFunction() {
	//TODO: implement this test fully, it should ideally not just be testing for an error,
	// for the initial implementation, this is setting up available params etc.
	testScheduler := suite.NewTestScheduler()

	stubJob := suite.NewScheduledJobStub(testScheduler)

	err := sendAsyncVotingHalfwayThroughEmailJobFunction(suite.testConfigs.Context, stubJob)
	suite.NoError(err)
}
