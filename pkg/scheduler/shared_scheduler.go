package scheduler

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
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

	registry := JobRegistry()
	registry[name] = registerJob
}

// GetScheduler initializes (if needed) and returns the shared scheduler.
func GetScheduler() gocron.Scheduler {
	onceScheduler.Do(func() {
		s, err := gocron.NewScheduler()
		if err != nil {
			log.Panic(fmt.Errorf("error creating scheduler: %v", err))

		}
		sharedScheduler = s
	})
	return sharedScheduler
}

// StartScheduler runs the scheduler on a separate goroutine and registers jobs.
func StartScheduler(logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders, emailClient *email.Client) {
	scheduler := GetScheduler()

	ctx := CreateSchedulerContext(context.Background(), logger, store, buildDataLoaders, emailClient)

	// Register all jobs dynamically
	mutex.Lock()
	for _, registerJob := range jobRegistry {
		_, err := registerJob(ctx, store, scheduler) // Execute the job function to add it to the scheduler
		if err != nil {
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

// OneTimeJob schedules a job to run once immediately
// make sure to instantiate it with the expected dependencies in context.
// it is intended to be used when another job should be created from a scheduled job
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
