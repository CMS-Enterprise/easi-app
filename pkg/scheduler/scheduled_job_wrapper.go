package scheduler

import (
	"context"
	"fmt"

	"github.com/go-co-op/gocron/v2"
)

// ScheduledJobFunction is an abstraction around scheduled jobs and tasks it defines
type ScheduledJobFunction[input comparable] func(context.Context, input)

type ScheduleJobWrapper[input comparable] struct {
	jobFunction ScheduledJobFunction[input]
	job         gocron.Job
}

// NewScheduledJobWrapper holds the logic to initialize a new scheduled job
func NewScheduledJobWrapper[input comparable](scheduler gocron.Scheduler, jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[input]) ScheduleJobWrapper[input] {

	//TODO,
	sjw := ScheduleJobWrapper[input]{
		jobFunction: jobFunction,
	}
	job, err := scheduler.NewJob(
		jobDefinition,
		gocron.NewTask(
			jobFunction,
		),
		// TODO figure out job registration options
		gocron.WithContext(context.Background()),
	)
	if err != nil {
		fmt.Errorf("error creating scheduler: %v", err)
		//TODO: log error
	}
	sjw.job = job

	return sjw
}
