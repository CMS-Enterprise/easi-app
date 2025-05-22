package scheduler

import (
	"context"

	"github.com/go-co-op/gocron/v2"

	"github.com/cms-enterprise/easi-app/pkg/local"
)

//TODO implement shared testing utilities

// // TestShardScheduler tests the shard scheduler
// func TestShardScheduler(t *testing.T) {
// 	testhelpers.NewConfig()
// 	StartScheduler(nil, nil, nil)

// }

func (suite *SchedulerTestSuite) NewTestScheduler() *Scheduler {
	testScheduler, err := NewScheduler(false)
	suite.NoError(err)
	testScheduler.Initialize(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Store, suite.buildDataLoaders(), suite.testConfigs.EmailClient, local.NewOktaAPIClient())
	return testScheduler
}

// NewScheduledJobStub mocks out a scheduled job so we can run the function manually for testing.
// It is never registered so the function is not run on schedule
func (suite *SchedulerTestSuite) NewScheduledJobStub(scheduler *Scheduler) *ScheduledJob {
	// this test definition is a one time job that starts immediately. However, the scheduler
	nonExistentCron := "5 4 31 2 1"
	//“At 04:05 on day-of-month 31 and on Monday in February.”
	testDefinition := gocron.CronJob(nonExistentCron, false)

	scheduledJob := &ScheduledJob{
		ScheduledJobWrapper: ScheduledJobWrapper[*ScheduledJob]{
			name:          "test-job",
			jobDefinition: testDefinition,
			// the
			jobFunction: func(ctx context.Context, params *ScheduledJob) error { return nil },
			params:      &ScheduledJob{},
			scheduler:   scheduler,
		},
	}
	// Note, the job is never registered so it is never run
	return scheduledJob

}
