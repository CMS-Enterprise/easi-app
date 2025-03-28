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

// getGRBEmailJobs initializes all GRB email jobs
func getGRBEmailJobs(scheduler *Scheduler) *grbEmailJobs {
	return &grbEmailJobs{
		SendAsyncVotingHalfwayThroughEmailJob: NewScheduledJob("SendAsyncVotingHalfwayThroughEmailJob", scheduler,
			timing.DailyAt2AM,
			sendAsyncVotingHalfwayThroughEmailJobFunction),
	}
}
func sendAsyncVotingHalfwayThroughEmailJobFunction(ctx context.Context, scheduledJob *ScheduledJob) {
    // See the app code for the current method
}
```

### Dependencies

Dependencies are handled through the Scheduler struct. They are passed in upon initialization, which happens in the main thread.

Jobs themselves currently have a reference to their scheduler, so dependencies can be retrieved. There are convenience methods to retrieve the needed dependencies. 

Dependencies also exist in the context. The context is provided to every job when the shared scheduler is started.

The method `CreateSchedulerContext` in [`context.go`](context.go) demonstrates what currently exists on the job. It is important if creating a job through another location in the code to provide the needed parameters to the context.

### One Time Jobs

The scheduler also supports the ability to create jobs that are only run once. This allows a job to create multiple child jobs. Please make sure to pay attention to context and dependencies here.

There is a helper method for this currently in  to facilitate creating one time jobs. It's best practice to use these only when running the job immediately (see below on persistence)

### Logging
The `decoratedLogger` receiver method on [`ScheduledJobWrapper`](scheduled_job_wrapper.go) will return standard information about a scheduled job on the logger. This allows us to key off of this information if we need to explore any jobs running through splunk.

The logger method on the scheduled job will also decorate the logger with the current job information from the scheduler.

## Lifecycle and Persistence

It is important to note that this current implementation does not have persistence like an external service would have. This means that a new instance of the job will be created when the app restarts. It is vitally important to remember this when structuring scheduled tasks, and implement a form of persistence in the database if needed for your task. Otherwise there could be scenarios where jobs fire multiple times creating a duplicative experience for the users.


### The timing package
the timing package provides a place that we can store cron job definitions. This is useful for jobs that might be run on the same schedule, or for testing a job to run at a more frequent rate for testing. It is also appropriate if a jobs timing is specific to itself to define the timing in the same file as the job.
