package scheduler

import (
	"context"
	"fmt"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/logfields"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// ScheduledJobFunction is an abstraction around scheduled jobs and tasks it defines
type ScheduledJobFunction[input comparable] func(context.Context, input)

// RegisterJobFunction is a function that registers a job with the scheduler and returns the job
type RegisterJobFunction func(context.Context, *storage.Store, gocron.Scheduler) (gocron.Job, error)

type ScheduledJobWrapper[input comparable] struct {
	name          string
	jobDefinition gocron.JobDefinition
	jobFunction   ScheduledJobFunction[input]
	params        input
	job           gocron.Job
}
type ScheduledJob struct {
	ScheduledJobWrapper[*ScheduledJob] // Embed the wrapper with a pointer to ScheduledJob
}

// RunJob is a wrapper for running the job.
func (sjw *ScheduledJobWrapper[input]) RunJob(ctx context.Context, params input) {
	sjw.jobFunction(ctx, params)

}

func (sjw *ScheduledJobWrapper[input]) Register() {
	RegisterJob(sjw.name, func(ctx context.Context, store *storage.Store, scheduler gocron.Scheduler) (gocron.Job, error) {
		retJob, err := scheduler.NewJob(
			sjw.jobDefinition,
			gocron.NewTask(sjw.RunJob, sjw.params),
			// gocron.NewTask(sjw.jobFunction, sjw.params, scheduler),
			gocron.WithContext(ctx),
		)
		if err != nil {
			return nil, fmt.Errorf("error scheduling job: %v", err)
		}
		sjw.job = retJob
		return retJob, nil
	})
}

// decoratedLogger returns a logger with the job's metadata
func (sjw *ScheduledJobWrapper[input]) decoratedLogger(logger *zap.Logger) *zap.Logger {
	lastRun, errLastRun := sjw.job.LastRun()
	nextRun, errNextRun := sjw.job.NextRun()

	decoratedLogger := logger.With(logfields.SchedulerAppSection,
		logfields.JobID(sjw.job.ID()),
		logfields.JobName(sjw.name),
		logfields.NextRunTime(nextRun),
		logfields.LastRunTime(lastRun),
	)
	if errLastRun != nil {
		decoratedLogger.Warn("error getting last run time", zap.Error(errLastRun))
	}
	if errNextRun != nil {
		decoratedLogger.Warn("error getting next run time", zap.Error(errNextRun))
	}
	return decoratedLogger

}

// NewScheduledJobWrapper holds the logic to initialize a new scheduled job
func NewScheduledJobWrapper[input comparable](jobName string, scheduler gocron.Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[input], params input) ScheduledJobWrapper[input] {

	sjw := ScheduledJobWrapper[input]{
		name:          jobName,
		jobDefinition: jobDefinition,
		jobFunction:   jobFunction,
		params:        params,
	}
	sjw.Register()
	// Note, we do not instantiate the job here, it is the responsibility of the RegisterJobFunction to do so. This happens when the defined scheduler is started.

	return sjw
}
func NewScheduledJob(jobName string, scheduler gocron.Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[*ScheduledJob]) ScheduledJob {
	// Create an empty ScheduledJob instance
	sj := ScheduledJob{
		ScheduledJobWrapper: ScheduledJobWrapper[*ScheduledJob]{
			name:          jobName,
			jobDefinition: jobDefinition,
			jobFunction:   jobFunction,
			params:        nil, // params is *ScheduledJob, so nil initially
		},
	}
	sj.params = &sj

	sj.Register()

	return sj
}
