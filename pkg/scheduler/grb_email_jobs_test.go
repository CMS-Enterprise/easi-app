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

	// create test intake that is halfway through (started 3 days ago, ends in 4 days)
	now := time.Now()
	testIntake := &models.SystemIntake{
		GRBReviewStartedAt:    helpers.PointerTo(now.AddDate(0, 0, -3)),
		GrbReviewAsyncEndDate: helpers.PointerTo(now.AddDate(0, 0, 4)),
		Step:                  models.SystemIntakeStepINITIALFORM,
		RequestType:           models.SystemIntakeRequestTypeNEW,
	}
	createdIntake, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, testIntake)
	suite.NoError(err)
	suite.NotNil(createdIntake)

	// TODO: return successCount/failureCount from these functions and update `OneTimeJob` to take a more generic style `func (ctx) error` or something similar
	// once that is done, we can test if this worked vs just not-errored
	err = sendAsyncVotingHalfwayThroughEmailJobFunction(suite.testConfigs.Context, stubJob)
	suite.NoError(err)
}
