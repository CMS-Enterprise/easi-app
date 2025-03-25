package scheduler

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

var (
	sharedScheduler gocron.Scheduler

	jobRegistry   map[string]RegisterJobFunction
	onceScheduler sync.Once
	onceRegistry  sync.Once
	mutex         sync.Mutex
)

// JobRegistry returns the shared job registry.
func JobRegistry() map[string]RegisterJobFunction {
	onceRegistry.Do(func() {
		jobRegistry = make(map[string]RegisterJobFunction)

	})
	return jobRegistry
}

// RegisterJob stores a job registration function to be initialized later.
func RegisterJob(name string, registerJob RegisterJobFunction) {
	mutex.Lock()
	defer mutex.Unlock()

	// if registry == nil {
	// 	fmt.Println("registry is unexpectedly nil! Re-initializing...")
	// 	registry = make(map[string]RegisterJobFunction)
	// }
	registry := JobRegistry()
	registry[name] = registerJob
}

// TODO, verify this again

// GetScheduler initializes (if needed) and returns the shared scheduler.
func GetScheduler() gocron.Scheduler {
	onceScheduler.Do(func() {
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
func StartScheduler(logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders) {
	scheduler := GetScheduler()

	// TODO, perhaps just wrap the store in the context as well?
	ctx := CreateSchedulerContext(context.Background(), logger, store, buildDataLoaders)

	// Register all jobs dynamically
	mutex.Lock()
	for _, registerJob := range jobRegistry {
		_, err := registerJob(ctx, store, scheduler) // Execute the job function to add it to the scheduler
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

// TODO: how can we provide one time jobs with needed dependencies in context? Should we just have them implemented in the task? Should we perhaps use generics here to define the param for any? Or just not take params?

// OneTimeJob schedules a job to run once immediately
func OneTimeJob[input comparable](ctx context.Context, params input, name string, jobFunction ScheduledJobFunction[input]) (gocron.Job, error) {
	scheduler := GetScheduler()
	retJob, err := scheduler.NewJob(gocron.OneTimeJob(gocron.OneTimeJobStartImmediately()),
		gocron.NewTask(jobFunction, params),
		gocron.WithContext(ctx),
	)

	if err != nil {
		return nil, fmt.Errorf("error scheduling job: %v", err)
	}
	return retJob, nil
}
