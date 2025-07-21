package scheduler

import (
	"context"
	"fmt"

	"github.com/go-co-op/gocron/v2"
)

// OneTimeJob schedules a job to run once immediately
// make sure to instantiate it with the expected dependencies in context.
// it is intended to be used when another job should be created from a scheduled job
func OneTimeJob[input comparable](ctx context.Context, scheduler gocron.Scheduler, params input, name string, jobFunction ScheduledJobFunction[input]) (gocron.Job, error) {
	retJob, err := scheduler.NewJob(gocron.OneTimeJob(gocron.OneTimeJobStartImmediately()),
		gocron.NewTask(jobFunction, params),
		gocron.WithContext(ctx),
	)

	if err != nil {
		return nil, fmt.Errorf("error scheduling job: %v", err)
	}
	return retJob, nil
}
