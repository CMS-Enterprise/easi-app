// scheduler contains the logic for scheduled tasks that run in the main thread of the EASI application
package scheduler

import (
	"time"

	"github.com/go-co-op/gocron/v2"
)

func TestJobSchedule() error {
	//TODO: do we want any options for the scheduler?
	s, err := gocron.NewScheduler()
	if err != nil {
		return err
	}

	j, err := s.NewJob(
		gocron.DurationJob(
			10*time.Second,
		),
		gocron.NewTask(
			func(a string, b int) {
				// do things
			},
			"hello",
			1,
		),
	)
	if err != nil {
		return err
	}
	_ = j

	return nil
}
