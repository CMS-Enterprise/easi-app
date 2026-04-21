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

type scheduler struct {
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

// mustNewScheduler successfully creates a new `scheduler` or panics
func mustNewScheduler() *scheduler {
	sched, err := newScheduler()
	if err != nil {
		log.Panic(fmt.Errorf("error creating scheduler: %w", err))
	}

	return sched
}

// newScheduler creates a new scheduler
func newScheduler() (*scheduler, error) {
	sched, err := gocron.NewScheduler()
	if err != nil {
		return nil, err

	}
	return &scheduler{
		Scheduler:   sched,
		registry:    make(map[string]RegisterJobFunction),
		initialized: false,
	}, nil
}

var SharedScheduler = mustNewScheduler()

// Initialize sets the logger, store, an email client, and a userSearchClient(Okta) for the shared scheduler
func (s *scheduler) Initialize(ctx context.Context, logger *zap.Logger, store *storage.Store, buildDataLoaders dataloaders.BuildDataloaders, emailClient *email.Client, userSearchClient usersearch.Client) {
	l := logger.With(logfields.SchedulerAppSection)
	s.logger = l
	s.context = appcontext.WithLogger(ctx, l)
	s.store = store
	s.emailClient = emailClient
	s.userSearchClient = userSearchClient
	s.buildDataLoaders = buildDataLoaders
	s.initialized = true

	s.mutex.Lock()
	defer s.mutex.Unlock()

	for _, registerJobFunc := range s.registry {
		_, err := registerJobFunc(s.context) // Execute the job function to add it to the scheduler
		if err != nil {
			s.logger.Error("error registering job:", zap.Error(err))
		}
	}
}

// registerJob stores a job registration function to be initialized later.
func (s *scheduler) registerJob(name string, registerJob RegisterJobFunction) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.registry[name] = registerJob
}

// Start is a wrapper that calls the underlying gocron scheduler start method.
// It is intended to be used when the scheduler is not started in the main thread.
func (s *scheduler) Start() {
	s.Scheduler.Start()
}
func (s *scheduler) Stop() error {
	err := s.Shutdown()

	if err != nil {
		s.logger.Error("failed to shutdown scheduler", zap.Error(err))
		return err
	}

	s.logger.Info("Scheduler stopped successfully")
	return nil
}
