// scheduler contains the logic for scheduled tasks that run in the main thread of the EASI application
package scheduler

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/go-co-op/gocron/v2"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/logfields"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/usersearch"
)

type Scheduler struct {
	gocron.Scheduler
	context          context.Context
	store            *storage.Store
	registry         map[string]RegisterJobFunction
	mutex            sync.Mutex
	logger           *zap.Logger
	emailClient      *email.Client
	userSearchClient usersearch.Client
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

// Initialize sets the logger, store, an email client, and a userSearchClient(Okta) for the shared scheduler
func (s *Scheduler) Initialize(ctx context.Context, logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders, emailClient *email.Client, userSearchClient usersearch.Client) {
	l := logger.With(logfields.SchedulerAppSection)
	s.logger = l
	s.context = appcontext.WithLogger(ctx, l)
	s.store = store
	s.emailClient = emailClient
	s.userSearchClient = userSearchClient
	s.buildDataLoaders = buildDataLoaders
	s.initialized = true

	s.mutex.Lock()
	for _, registerJob := range s.registry {
		_, err := registerJob(s.context) // Execute the job function to add it to the scheduler
		if err != nil {
			s.logger.Error("error registering job:", zap.Error(err))
		}
	}
	s.mutex.Unlock()
}

// registerJob stores a job registration function to be initialized later.
func (s *Scheduler) registerJob(name string, registerJob RegisterJobFunction) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.registry[name] = registerJob
}

// Start is a wrapper that calls the underlying gocron scheduler start method.
// It is intended to be used when the scheduler is not started in the main thread.
func (s *Scheduler) Start() {
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
