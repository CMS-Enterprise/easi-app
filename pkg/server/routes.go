package server

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/services"
	"github.com/cmsgov/easi-app/pkg/storage"
)

func (s *Server) routes(
	authorizationMiddleware func(handler http.Handler) http.Handler,
	corsMiddleware func(handler http.Handler) http.Handler,
	traceMiddleware func(handler http.Handler) http.Handler,
	loggerMiddleware func(handler http.Handler) http.Handler) {

	// trace all requests with an ID
	s.router.Use(traceMiddleware)

	// health check goes directly on the main router to avoid auth
	healthCheckHandler := handlers.HealthCheckHandler{
		Config: s.Config,
	}
	s.router.HandleFunc("/api/v1/healthcheck", healthCheckHandler.Handle())

	// set up CEDAR client
	cedarClient := cedar.NewTranslatedClient(
		s.Config.GetString("CEDAR_API_URL"),
		s.Config.GetString("CEDAR_API_KEY"),
	)

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// add a request based logger
	api.Use(loggerMiddleware)

	// wrap with CORs
	api.Use(corsMiddleware)

	// protect all API routes with authorization middleware
	api.Use(authorizationMiddleware)

	db, err := sqlx.Connect("postgres", "user=postgres sslmode=disable")

	if err != nil {
		// Todo when database should be connected to every time, change this to error
		fmt.Println(err)
	}

	store := storage.NewStore(
		db,
		s.logger,
	)

	// endpoint for system list
	systemHandler := handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Logger:       s.logger,
	}
	api.Handle("/systems", systemHandler.Handle())

	systemIntakeHandler := handlers.SystemIntakeHandler{
		Logger: s.logger,
		SaveSystemIntake: services.NewSaveSystemIntake(
			store.SaveSystemIntake,
			func(uuid uuid.UUID) (*models.SystemIntake, error) { return nil, nil },
			services.NewAuthorizeSaveSystemIntake(s.logger),
			s.logger,
		),
		FetchSystemIntakeByID: services.NewFetchSystemIntakeByID(
			store.FetchSystemIntakeByID,
			s.logger,
		),
	}

	api.Handle("/system_intake/{intake_id}", systemIntakeHandler.Handle())
	//api.Handle("/system_intake/", systemIntakeHandler.Handle())

	if s.Config.GetString("ENVIRONMENT") == "LOCAL" {
		systemIntakesHandler := handlers.SystemIntakesHandler{
			Logger:             s.logger,
			FetchSystemIntakes: services.FetchSystemIntakesByEuaID,
			DB:                 db,
		}
		api.Handle("/system_intakes", systemIntakesHandler.Handle())
	}
}
