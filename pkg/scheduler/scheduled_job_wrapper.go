package scheduler

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/go-co-op/gocron/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/usersearch"
)

// ScheduledJobFunction is an abstraction around scheduled jobs and tasks it defines
// TODO: consider adding additional output parameters to the function signature. This can also be a generic
// while not useful for the scheduler itself, it might be useful for testing purposes to validate the results.
type ScheduledJobFunction[input comparable] func(context.Context, input) error

// RegisterJobFunction is a function that registers a job with the scheduler and returns the job
type RegisterJobFunction func(context.Context) (gocron.Job, error)

type ScheduledJobWrapper[input comparable] struct {
	name          string
	jobDefinition gocron.JobDefinition
	jobFunction   ScheduledJobFunction[input]
	params        input
	job           gocron.Job
	// This is a reference to the scheduler that will be used to run the job, and provide dependencies
	// such as the logger, store, and email client
	scheduler *Scheduler
}

// store returns the store from the scheduler
func (sjw *ScheduledJobWrapper[input]) store() (*storage.Store, error) {
	if sjw.scheduler == nil || sjw.scheduler.store == nil {
		return nil, errors.New("scheduler is not initialized")
	}
	return sjw.scheduler.store, nil
}

// logger returns the logger from the scheduler
func (sjw *ScheduledJobWrapper[input]) logger(ctx context.Context) (*zap.Logger, error) {
	if sjw.scheduler == nil || sjw.scheduler.logger == nil {
		return nil, errors.New("scheduler is not initialized")
	}

	return sjw.decoratedLogger(ctx, sjw.scheduler.logger), nil
}

// emailClient returns the email client from the scheduler
func (sjw *ScheduledJobWrapper[input]) emailClient() (*email.Client, error) {
	if sjw.scheduler == nil || sjw.scheduler.emailClient == nil {
		return nil, errors.New("scheduler is not initialized")
	}
	return sjw.scheduler.emailClient, nil
}

// userSearchClient returns the userSearchClient from the scheduler
func (sjw *ScheduledJobWrapper[input]) userSearchClient() (usersearch.Client, error) {
	if sjw.scheduler == nil || sjw.scheduler.userSearchClient == nil {
		return nil, errors.New("scheduler is not initialized")
	}
	return sjw.scheduler.userSearchClient, nil
}

// buildDataLoaders returns the buildDataLoaders function from the scheduler
func (sjw *ScheduledJobWrapper[input]) buildDataLoaders() (dataloaders.BuildDataloaders, error) {
	if sjw.scheduler == nil || sjw.scheduler.buildDataLoaders == nil {
		return nil, errors.New("scheduler is not initialized")
	}
	return sjw.scheduler.buildDataLoaders, nil
}

// ScheduledJob is a concrete implementation of the ScheduledJobWrapper, that passes itself as a parameter to the job function
type ScheduledJob struct {
	ScheduledJobWrapper[*ScheduledJob] // Embed the wrapper with a pointer to ScheduledJob
}

// RunJob is a wrapper for running the job. The scheduler itself doesn't do anything with errors,
// so we wrap logging information here
func (sjw *ScheduledJobWrapper[input]) RunJob(ctx context.Context, params input) error {
	ctx, _ = appcontext.WithTrace(ctx)

	logger, err := sjw.logger(ctx)
	if err != nil {
		return err
	}

	logger.Info("running scheduled job job")
	if err := sjw.jobFunction(ctx, params); err != nil {
		logger.Error("error running job", zap.Error(err))
		return err
	}
	logger.Info("job completed successfully")
	return nil
}

func (sjw *ScheduledJobWrapper[input]) Register(scheduler *Scheduler) {
	scheduler.registerJob(sjw.name, func(ctx context.Context) (gocron.Job, error) {
		retJob, err := scheduler.NewJob(
			sjw.jobDefinition,
			gocron.NewTask(sjw.RunJob, sjw.params),
			// Note, if desired, you could pass scheduler directly like this. Currently, it is referenced in the scheduled job
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
// ideally, you should just call the logger method on the ScheduledJobWrapper, which in turn calls this.
func (sjw *ScheduledJobWrapper[input]) decoratedLogger(ctx context.Context, logger *zap.Logger) *zap.Logger {
	var lastRun time.Time
	var nextRun time.Time
	var errLastRun error
	var errNextRun error
	var jobID uuid.UUID
	var traceIDString string

	if sjw.job != nil {
		lastRun, errLastRun = sjw.job.LastRun()
		nextRun, errNextRun = sjw.job.NextRun()
		jobID = sjw.job.ID()
	}
	traceIDUUID, traceIDExists := appcontext.Trace(ctx)
	if !traceIDExists {
		traceIDUUID = uuid.New()
		traceIDString = traceIDUUID.String() + "new"
	} else {
		traceIDString = traceIDUUID.String()
	}

	decoratedLogger := logger.With(logfields.SchedulerAppSection,
		logfields.JobID(jobID),
		logfields.JobName(sjw.name),
		logfields.NextRunTime(nextRun),
		logfields.LastRunTime(lastRun),
		logfields.TraceField(traceIDString),
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
func NewScheduledJobWrapper[input comparable](jobName string, scheduler *Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[input], params input) ScheduledJobWrapper[input] {

	sjw := ScheduledJobWrapper[input]{
		name:          jobName,
		jobDefinition: jobDefinition,
		jobFunction:   jobFunction,
		params:        params,
	}
	sjw.Register(scheduler)
	// Note, we do not instantiate the job here, it is the responsibility of the RegisterJobFunction to do so. This happens when the defined scheduler is started.

	return sjw
}
func NewScheduledJob(jobName string, scheduler *Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[*ScheduledJob]) ScheduledJob {
	// Create an empty ScheduledJob instance
	sj := ScheduledJob{
		ScheduledJobWrapper: ScheduledJobWrapper[*ScheduledJob]{
			name:          jobName,
			jobDefinition: jobDefinition,
			jobFunction:   jobFunction,
			params:        nil, // params is *ScheduledJob, so nil initially
		},
	}
	sj.scheduler = scheduler
	sj.params = &sj

	sj.Register(scheduler)

	return sj
}
