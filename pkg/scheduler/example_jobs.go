package scheduler

import (
	"context"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
)

// exampleJobs is a struct that holds all the example jobs. It is not meant to be run in production
// , but rather to show how to create a job.
type exampleJobs struct {
	RunEvery5SecondJob ScheduleJobWrapper[bool]
	SimplifiedJob      ScheduledJob
}

// var ExampleJobs = GetExampleJobs(GetScheduler())

// GetExampleJobs returns a new exampleJobs struct with all the example jobs
func GetExampleJobs(scheduler gocron.Scheduler) *exampleJobs {
	return &exampleJobs{
		SimplifiedJob:      NewScheduledJob("SimplifiedJob", scheduler, gocron.CronJob("*/5 * * * * *", true), simplifiedJobFunction),
		RunEvery5SecondJob: NewScheduledJobWrapper("RunEverySecondJob", scheduler, gocron.CronJob("*/5 * * * * *", true), runEvery5SecondJobFunction, true),
	}
}
func simplifiedJobFunction(ctx context.Context, scheduledJob *ScheduledJob) {

	logger := scheduledJob.decoratedLogger(appcontext.ZLogger(ctx))

	logger.Info("Running simplified job")
}

func runEvery5SecondJobFunction(ctx context.Context, input bool) {
	_ = input
	logger := appcontext.ZLogger(ctx)

	logger.Info("Running every second job")
	logger.Info("input: %", zap.Bool("input:", input))
}
