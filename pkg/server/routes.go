package server

import (
	"net/http"

	"github.com/facebookgo/clock"
	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appses"
	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/local"
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

	if s.environment.Deployed() {
		s.CheckCEDARClientConnection(cedarClient)
	}

	// set up Email Client
	sesConfig := s.NewSESConfig()
	sesSender := appses.NewSender(sesConfig)
	emailConfig := s.NewEmailConfig()
	emailClient, err := email.NewClient(emailConfig, sesSender)
	if err != nil {
		s.logger.Fatal("Failed to create email client", zap.Error(err))
	}
	// override email client with local one
	if s.environment.Local() {
		localSender := local.NewSender(s.logger)
		emailClient, err = email.NewClient(emailConfig, localSender)
		if err != nil {
			s.logger.Fatal("Failed to create email client", zap.Error(err))
		}
	}

	if s.environment.Deployed() {
		s.CheckEmailClient(emailClient)
	}

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// add a request based logger
	api.Use(loggerMiddleware)

	// wrap with CORs
	api.Use(corsMiddleware)

	// protect all API routes with authorization middleware
	api.Use(authorizationMiddleware)

	store, err := storage.NewStore(
		s.logger,
		s.NewDBConfig(),
	)
	if err != nil {
		s.logger.Fatal("Failed to connect to database", zap.Error(err))
	}

	// endpoint for system list
	systemHandler := handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Logger:       s.logger,
	}
	api.Handle("/systems", systemHandler.Handle())

	handlerClock := clock.New()
	systemIntakeHandler := handlers.SystemIntakeHandler{
		Logger: s.logger,
		SaveSystemIntake: services.NewSaveSystemIntake(
			store.SaveSystemIntake,
			store.FetchSystemIntakeByID,
			services.NewAuthorizeSaveSystemIntake(s.logger),
			cedarClient.ValidateAndSubmitSystemIntake,
			emailClient.SendSystemIntakeSubmissionEmail,
			s.logger,
			handlerClock,
		),
		FetchSystemIntakeByID: services.NewFetchSystemIntakeByID(
			store.FetchSystemIntakeByID,
			s.logger,
		),
	}
	api.Handle("/system_intake/{intake_id}", systemIntakeHandler.Handle())
	api.Handle("/system_intake", systemIntakeHandler.Handle())

	systemIntakesHandler := handlers.SystemIntakesHandler{
		Logger: s.logger,
		FetchSystemIntakes: services.NewFetchSystemIntakesByEuaID(
			store.FetchSystemIntakesByEuaID,
			s.logger,
		),
	}
	api.Handle("/system_intakes", systemIntakesHandler.Handle())

	businessCaseHandler := handlers.BusinessCaseHandler{
		Logger: s.logger,
		CreateBusinessCase: services.NewCreateBusinessCase(
			store.FetchSystemIntakeByID,
			services.NewAuthorizeCreateBusinessCase(s.logger),
			store.CreateBusinessCase,
			s.logger,
			handlerClock,
		),
		FetchBusinessCaseByID: services.NewFetchBusinessCaseByID(
			store.FetchBusinessCaseByID,
			s.logger,
		),
		UpdateBusinessCase: services.NewUpdateBusinessCase(
			store.FetchBusinessCaseByID,
			services.NewAuthorizeUpdateBusinessCase(s.logger),
			store.UpdateBusinessCase,
			emailClient.SendBusinessCaseSubmissionEmail,
			s.logger,
			handlerClock,
		),
	}
	api.Handle("/business_case/{business_case_id}", businessCaseHandler.Handle())
	api.Handle("/business_case", businessCaseHandler.Handle())

	businessCasesHandler := handlers.BusinessCasesHandler{
		Logger: s.logger,
		FetchBusinessCases: services.NewFetchBusinessCasesByEuaID(
			store.FetchBusinessCasesByEuaID,
			s.logger,
		),
	}
	api.Handle("/business_cases", businessCasesHandler.Handle())

	metricsHandler := handlers.MetricsHandler{
		FetchMetrics: services.NewFetchMetrics(s.logger, store.FetchSystemIntakeMetrics),
		Logger:       s.logger,
		Clock:        handlerClock,
	}
	api.Handle("/metrics", metricsHandler.Handle())

	s.router.PathPrefix("/").Handler(handlers.CatchAllHandler{
		Logger: s.logger,
	}.Handle())
}
