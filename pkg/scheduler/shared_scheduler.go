package scheduler

import (
	"fmt"
	"log"
	"sync"

	"github.com/go-co-op/gocron/v2"
)

var (
	sharedScheduler gocron.Scheduler
	once            sync.Once
)

// TODO, verify this again

// GetScheduler initializes (if needed) and returns the shared scheduler.
func GetScheduler() gocron.Scheduler {
	once.Do(func() {
		s, err := gocron.NewScheduler()
		if err != nil {
			log.Fatal(fmt.Errorf("error creating scheduler: %v", err))

			//TODO: log error
		}
		sharedScheduler = s
	})
	return sharedScheduler
}
