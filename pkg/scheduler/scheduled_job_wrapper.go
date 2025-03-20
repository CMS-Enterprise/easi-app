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
func NewScheduledJobWrapper[input comparable](jobDefinition gocron.JobDefinition, jobFunction ScheduledJobFunction[input]) ScheduleJobWrapper[input] {

	// TODO, we might want to pass in the scheduler as a parameter so that it is shared. This will require initialization
	s, err := gocron.NewScheduler()
	if err != nil {
		fmt.Errorf("error creating scheduler: %v", err)
		//TODO: log error
	}

	//TODO,
	sjw := ScheduleJobWrapper[input]{
		jobFunction: jobFunction,
	}
	sjw.job, err = s.NewJob(
		jobDefinition,
		gocron.NewTask(
			jobFunction,
		),
	)
	if err != nil {
		fmt.Errorf("error creating scheduler: %v", err)
		//TODO: log error
	}

	return sjw
}
