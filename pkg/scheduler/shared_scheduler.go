package scheduler

import (
	"fmt"
	"log"
	"sync"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/storage"
)

var (
	sharedScheduler gocron.Scheduler
	once            sync.Once
	mutex           sync.Mutex
)

// var jobList map[string]ScheduleJobWrapper

// TODO, perhaps change this to a get function with a once to ensure it is only initialized once

var jobRegistry map[string]RegisterJobFunction // Holds job registration functions

// RegisterJob stores a job registration function to be initialized later.
func RegisterJob(name string, jobFunc RegisterJobFunction) {
	mutex.Lock()
	defer mutex.Unlock()

	if jobRegistry == nil {
		fmt.Println("jobRegistry is unexpectedly nil! Re-initializing...")
		jobRegistry = make(map[string]RegisterJobFunction)
	}
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
func StartScheduler(logger *zap.Logger, store *storage.Store) {
	scheduler := GetScheduler()

	// Register all jobs dynamically
	mutex.Lock()
	for _, jobFunc := range jobRegistry {
		_, err := jobFunc(store, scheduler) // Execute the job function to add it to the scheduler
		if err != nil {
			//TODO: should we stop the app if the job fails to register?
			logger.Error("error registering job:", zap.Error(err))
		}
	}
	mutex.Unlock()

	// Start the scheduler in a separate goroutine
	go scheduler.Start()
}

// StopScheduler is a wrapper for shutting down the shared scheduler, so it's shutdown can be deferred elsewhere
func StopScheduler(logger *zap.Logger) {
	scheduler := GetScheduler()
	err := scheduler.Shutdown()

	logger.Error("failed to shutdown scheduler", zap.Error(err))
}
