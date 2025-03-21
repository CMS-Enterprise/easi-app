package scheduler

import (
	"fmt"
	"log"
	"sync"

	"github.com/go-co-op/gocron/v2"

	"github.com/cms-enterprise/easi-app/pkg/storage"
)

var (
	sharedScheduler gocron.Scheduler
	once            sync.Once
	mutex           sync.Mutex
)

// var jobList map[string]ScheduleJobWrapper

var jobRegistry = make(map[string]func(*storage.Store, gocron.Scheduler)) // Holds job registration functions

// RegisterJob stores a job registration function to be initialized later.
func RegisterJob(name string, jobFunc func(*storage.Store, gocron.Scheduler)) {
	mutex.Lock()
	defer mutex.Unlock()
	jobRegistry[name] = jobFunc
}

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

func StartPredefinedJobs(store *storage.Store) {

}

// StartScheduler runs the scheduler on a separate goroutine and registers jobs.
func StartScheduler(store *storage.Store) {
	scheduler := GetScheduler()

	// Register all jobs dynamically
	mutex.Lock()
	for _, jobFunc := range jobRegistry {
		jobFunc(store, scheduler) // Execute the job function to add it to the scheduler
	}
	mutex.Unlock()

	// Start the scheduler in a separate goroutine
	go scheduler.Start()
}
