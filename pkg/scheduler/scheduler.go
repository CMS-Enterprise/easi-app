// scheduler contains the logic for scheduled tasks that run in the main thread of the EASI application
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

type Scheduler struct {
	gocron.Scheduler
	context          context.Context
	store            *storage.Store
	registry         map[string]RegisterJobFunction
	mutex            sync.Mutex
	logger           *zap.Logger
	emailClient      *email.Client
	buildDataLoaders dataloaders.BuildDataloaders
	initialized      bool
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

var SharedScheduler, _ = NewScheduler(true)

// Initialize sets the logger, store, and email client for the shared scheduler.
func (s *Scheduler) Initialize(ctx context.Context, logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders, emailClient *email.Client) {
	// TODO consider removing this context, but it is also useful as the jobs have it and can listen for cancellation through it
	s.context = CreateSchedulerContext(ctx, logger, store, buildDataLoaders, emailClient)
	s.logger = logger
	s.store = store
	s.emailClient = emailClient
	s.buildDataLoaders = buildDataLoaders
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
