# Scheduling

Scheduling in the EASI application is currently facilitated with `github.com/go-co-op/gocron/v2` library.

## Features

The library allows us to use cron syntax to schedule recurring and one time jobs in the context of the main application thread.

## EASi specific implementation

### Shared Scheduler [`pkg/scheduler/shared_scheduler.go`](shared_scheduler.go)

The Shared Scheduler is a singleton instance provides a mechanism to declare a `gocron` job in it's own file and register to a singleton scheduler at run time. The scheduler iterates through a map of jobs to create the instance of the job with dependencies in the routes file. 

The Scheduler is stopped by calling defer `StopScheduler` in the serve command

### Configuring new Jobs

Abstractions are made around jobs and their declaration using [`scheduled_job_wrapper.go`](scheduled_job_wrapper.go)

When a job needs to be created, it needs a type definition. That type definition can be instantiated as a package variable so that it gets registered to the shared scheduler on load.

 For example, `grbEmailJobs` is the struct which currently defines all the `GRBEmail` jobs (just one currently). The `GetGRBEmailJobs()` method returns a registered job through the `NewScheduledJob` method (which is a simplified version of `NewScheduledJobWrapper`, which requires an input parameter)

 Once the shared scheduler (accessed by `GetScheduler()`) is started, the jobs will be registered and started according to their job definition.

``` go
type grbEmailJobs struct {
	// SendAsyncVotingHalfwayThroughEmailJob is a job that sends an email when the voting session is halfway through
	SendAsyncVotingHalfwayThroughEmailJob ScheduledJob
}
var GRBEmailJobs = GetGRBEmailJobs(GetScheduler())

// GetGRBEmailJobs initializes all GRB email jobs
func GetGRBEmailJobs(scheduler gocron.Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJob("SendAsyncVotingHalfwayThroughEmailJob", scheduler,
			gocron.CronJob("0 2 * * *", false),
			sendAsyncVotingHalfwayThroughEmailJobFunction),
	}
}
func sendAsyncVotingHalfwayThroughEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) {
    // See the app code for the current method
}
```

### Dependencies
