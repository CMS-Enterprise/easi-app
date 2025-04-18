package scheduler

func (suite *SchedulerTestSuite) TestSendAsyncVotingHalfwayThroughEmailJobFunction() {
	//TODO: implement this test fully, it should ideally not just be testing for an error,
	// for the initial implementation, this is setting up available params etc.
	testScheduler := suite.NewTestScheduler()

	stubJob := suite.NewScheduledJobStub(testScheduler)

	// we can create one intake that is less than halfway through
	// and another that is more than halfway through

	err := sendAsyncVotingHalfwayThroughEmailJobFunction(suite.testConfigs.Context, stubJob)
	suite.NoError(err)
}
