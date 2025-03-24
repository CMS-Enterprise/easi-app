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

type ScheduleJobWrapper[input comparable] struct {
	name          string
	jobDefinition gocron.JobDefinition
	jobFunction   ScheduledJobFunction[input]
	params        input
	job           gocron.Job
}
type ScheduledJob struct {
	ScheduleJobWrapper[*ScheduledJob] // Embed the wrapper with a pointer to ScheduledJob
}

// type ScheduledJob struct {
// 	name          string
// 	jobDefinition gocron.JobDefinition
// 	jobFunction   ScheduledJobFunction[*ScheduledJob]
// 	params		*ScheduledJob
// 	job           gocron.Job
// }

func (sjw *ScheduleJobWrapper[input]) Register() {
	RegisterJob(sjw.name, func(ctx context.Context, store *storage.Store, scheduler gocron.Scheduler) (gocron.Job, error) {
		retJob, err := scheduler.NewJob(
			sjw.jobDefinition,
			gocron.NewTask(sjw.jobFunction, sjw.params),
			gocron.WithContext(ctx),
		)

		//TODO, do we care about sjw params for this statically defined jobs? I think it might make more sense to define them in the job function since they are static
		if err != nil {
			return nil, fmt.Errorf("error scheduling job: %v", err)
		}
		sjw.job = retJob
		return retJob, nil
	})
}

// decoratedLogger returns a logger with the job's metadata
func (sjw *ScheduleJobWrapper[input]) decoratedLogger(logger *zap.Logger) *zap.Logger {
	lastRun, errLastRun := sjw.job.LastRun()
	nextRun, errNextRun := sjw.job.NextRun()

	decoratedLogger := logger.With(logfields.SchedulerAppSection,
		logfields.JobID(sjw.job.ID()),
		logfields.JobName(sjw.name),
		logfields.NextRunTime(nextRun),
		logfields.LastRunTime(lastRun),
	)
	if errLastRun != nil {
		logger.Warn("error getting last run time", zap.Error(errLastRun))
	}
	if errNextRun != nil {
		logger.Warn("error getting next run time", zap.Error(errNextRun))
	}
	return decoratedLogger

}

// NewScheduledJobWrapper holds the logic to initialize a new scheduled job
func NewScheduledJobWrapper[input comparable](jobName string, scheduler gocron.Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[input], params input) ScheduleJobWrapper[input] {

	//TODO,
	sjw := ScheduleJobWrapper[input]{
		name:          jobName,
		jobDefinition: jobDefinition,
		jobFunction:   jobFunction,
		//TODO, is there any point to this? It is not dynamic if passed at this point in time....
		params: params,
	}
	sjw.Register()
	// Note, we do not instantiate the job here, it is the responsibility of the RegisterJobFunction to do so. This happens when the defined scheduler is started.

	return sjw
}
func NewScheduledJob(jobName string, scheduler gocron.Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[*ScheduledJob]) ScheduledJob {
	// Create an empty ScheduledJob instance
	sj := ScheduledJob{
		ScheduleJobWrapper: ScheduleJobWrapper[*ScheduledJob]{
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
