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

type Scheduler struct {
	gocron.Scheduler
	context     context.Context
	store       *storage.Store
	registry    map[string]RegisterJobFunction
	mutex       sync.Mutex
	logger      *zap.Logger
	emailClient *email.Client
	initialized bool
}

// NewScheduler creates a new scheduler.
// panicOnError is a flag that determines if the program should panic if the scheduler fails to initialize.
// This is useful for package level instantiation
func NewScheduler(panicOnError bool) (*Scheduler, error) {
	scheduler, err := gocron.NewScheduler()
	if err != nil {
		if panicOnError {
			log.Panic(fmt.Errorf("error creating scheduler: %v", err))
		}
		return nil, err

	}
	return &Scheduler{
		Scheduler:   scheduler,
		registry:    make(map[string]RegisterJobFunction),
		initialized: false,
	}, nil
}

var SharedScheduler2, _ = NewScheduler(true)

// Initialize sets the logger, store, and email client for the shared scheduler.
func (s *Scheduler) Initialize(ctx context.Context, logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders, emailClient *email.Client) {
	s.context = ctx
	s.logger = logger
	s.store = store
	s.emailClient = emailClient
	s.initialized = true
}

// RegisterJob stores a job registration function to be initialized later.
func (s *Scheduler) RegisterJob(name string, registerJob RegisterJobFunction) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.registry[name] = registerJob
}
func (s *Scheduler) Start() {
	// Register all jobs dynamically
	s.mutex.Lock()
	for _, registerJob := range s.registry {
		_, err := registerJob(s.context, s.store, s) // Execute the job function to add it to the scheduler
		if err != nil {
			s.logger.Error("error registering job:", zap.Error(err))
		}
	}
	s.mutex.Unlock()
	s.Scheduler.Start()
}
func (s *Scheduler) Stop() error {
	err := s.Shutdown()

	if err != nil {
		s.logger.Error("failed to shutdown scheduler", zap.Error(err))
		return err
	}

	s.logger.Info("Scheduler stopped successfully")
	return nil
}

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
func StopScheduler(logger *zap.Logger) error {
	scheduler := GetScheduler()
	err := scheduler.Shutdown()
	if err != nil {
		logger.Error("failed to shutdown scheduler", zap.Error(err))
		return err
	}
	logger.Info("Scheduler stopped successfully")
	return nil
}

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
