package scheduler

import (
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (suite *SchedulerTestSuite) TestSendAsyncVotingHalfwayThroughEmailJobFunction() {
	//TODO: implement this test fully, it should ideally not just be testing for an error,
	// for the initial implementation, this is setting up available params etc.
	testScheduler := suite.NewTestScheduler()

	stubJob := suite.NewScheduledJobStub(testScheduler)

	// create test intake that is more than halfway through (started 4 days ago, ends tomorrow)
	now := time.Now()
	testIntake := &models.SystemIntake{
		GRBReviewStartedAt:    helpers.PointerTo(now.AddDate(0, 0, -4)),
		GrbReviewAsyncEndDate: helpers.PointerTo(now.AddDate(0, 0, 1)),
		Step:                  models.SystemIntakeStepINITIALFORM,
		RequestType:           models.SystemIntakeRequestTypeNEW,
	}
	createdIntake, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, testIntake)
	suite.NoError(err)
	suite.NotNil(createdIntake)

	err = sendAsyncVotingHalfwayThroughEmailJobFunction(suite.testConfigs.Context, stubJob)
	suite.NoError(err)
}
