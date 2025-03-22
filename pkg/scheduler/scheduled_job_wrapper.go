package scheduler

import (
	"context"
	"fmt"

	"github.com/go-co-op/gocron/v2"

	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// ScheduledJobFunction is an abstraction around scheduled jobs and tasks it defines
type ScheduledJobFunction[input comparable] func(context.Context, input)

// RegisterJobFunction is a function that registers a job with the scheduler and returns the job
type RegisterJobFunction func(*storage.Store, gocron.Scheduler) (gocron.Job, error)

type ScheduleJobWrapper[input comparable] struct {
	name          string
	jobDefinition gocron.JobDefinition
	jobFunction   ScheduledJobFunction[input]
	params        input
	job           gocron.Job
}

func (sjw *ScheduleJobWrapper[input]) Register() {
	RegisterJob(sjw.name, func(store *storage.Store, scheduler gocron.Scheduler) (gocron.Job, error) {
		retJob, err := scheduler.NewJob(
			sjw.jobDefinition,
			gocron.NewTask(sjw.jobFunction, sjw.params),
		)
		//TODO, do we care about sjw params for this statically defined jobs? I think it might make more sense to define them in the job function since they are static
		if err != nil {
			return nil, fmt.Errorf("error scheduling job: %v", err)
		}
		sjw.job = retJob
		return retJob, nil
	})
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
