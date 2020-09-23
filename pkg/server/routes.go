package server

import (
	"net/http"

	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/appses"
	"github.com/cmsgov/easi-app/pkg/cedar/cedareasi"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/flags"
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

	// set up handler base
	base := handlers.NewHandlerBase(s.logger)

	// health check goes directly on the main router to avoid auth
	healthCheckHandler := handlers.NewHealthCheckHandler(
		base,
		s.Config,
	)
	s.router.HandleFunc("/api/v1/healthcheck", healthCheckHandler.Handle())

	// check we have all of the configs for CEDAR clients
	if s.environment.Deployed() {
		s.NewCEDARClientCheck()
	}

	// set up CEDAR client
	cedarEasiClient := cedareasi.NewTranslatedClient(
		s.Config.GetString("CEDAR_API_URL"),
		s.Config.GetString("CEDAR_API_KEY"),
	)

	cedarLdapClient := cedarldap.NewTranslatedClient(
		s.Config.GetString("CEDAR_API_URL"),
		s.Config.GetString("CEDAR_API_KEY"),
	)

	if s.environment.Deployed() {
		s.CheckCEDAREasiClientConnection(cedarEasiClient)
		s.CheckCEDARLdapClientConnection(cedarLdapClient)
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

	// set up LD Client
	var ldClient *ld.LDClient
	var ldUser *ld.User
	if s.environment.Local() {
		ldConfig := s.NewLDConfig()
		ldClient, err = flags.NewLDClient(ldConfig)
		if err != nil {
			s.logger.Fatal("Failed to connect to launch darkly", zap.Error(err))
		}
		anonUser := ld.NewAnonymousUser(s.Config.GetString("LD_ENV_USER"))
		ldUser = &anonUser
	}

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// add a request based logger
	api.Use(loggerMiddleware)

	// wrap with CORs
	api.Use(corsMiddleware)

	// protect all API routes with authorization middleware
	api.Use(authorizationMiddleware)

	serviceConfig := services.NewConfig(s.logger, ldClient)

	store, err := storage.NewStore(
		s.logger,
		s.NewDBConfig(),
	)
	if err != nil {
		s.logger.Fatal("Failed to connect to database", zap.Error(err))
	}

	// endpoint for flags list
	if ldClient != nil {
		flagsHandler := handlers.NewFlagsHandler(base, flags.NewFetchFlags(), *ldClient, *ldUser)
		api.Handle("/flags", flagsHandler.Handle())
	}

	// endpoint for systems list
	systemHandler := handlers.NewSystemsListHandler(
		base,
		cedarEasiClient.FetchSystems,
	)
	api.Handle("/systems", systemHandler.Handle())

	systemIntakeHandler := handlers.NewSystemIntakeHandler(
		base,
		services.NewCreateSystemIntake(
			serviceConfig,
			store.CreateSystemIntake,
		),
		services.NewUpdateSystemIntake(
			serviceConfig,
			store.UpdateSystemIntake,
			store.FetchSystemIntakeByID,
			services.NewAuthorizeUserIsIntakeRequester(),
			cedarLdapClient.FetchUserEmailAddress,
			emailClient.SendSystemIntakeReviewEmail,
			services.NewUpdateDraftSystemIntake(
				serviceConfig,
				services.NewAuthorizeUserIsIntakeRequester(),
				store.UpdateSystemIntake,
			),
			services.NewSubmitSystemIntake(
				serviceConfig,
				services.NewAuthorizeUserIsIntakeRequester(),
				store.UpdateSystemIntake,
				cedarEasiClient.ValidateAndSubmitSystemIntake,
				emailClient.SendSystemIntakeSubmissionEmail,
			),
			!s.environment.Prod(),
		),
		services.NewFetchSystemIntakeByID(
			serviceConfig,
			store.FetchSystemIntakeByID,
			services.NewAuthorizeFetchSystemIntakeByID(),
		),
		services.NewArchiveSystemIntake(
			serviceConfig,
			store.FetchSystemIntakeByID,
			store.UpdateSystemIntake,
			services.NewArchiveBusinessCase(
				serviceConfig,
				store.FetchBusinessCaseByID,
				store.UpdateBusinessCase,
			),
			services.NewAuthorizeArchiveSystemIntake(s.logger),
		),
	)
	api.Handle("/system_intake/{intake_id}", systemIntakeHandler.Handle())
	api.Handle("/system_intake", systemIntakeHandler.Handle())

	systemIntakesHandler := handlers.NewSystemIntakesHandler(
		base,
		services.NewFetchSystemIntakesByEuaID(
			serviceConfig,
			store.FetchSystemIntakesByEuaID,
			services.NewAuthorizeFetchSystemIntakesByEuaID(),
		),
	)
	api.Handle("/system_intakes", systemIntakesHandler.Handle())

	businessCaseHandler := handlers.NewBusinessCaseHandler(
		base,
		services.NewFetchBusinessCaseByID(
			serviceConfig,
			store.FetchBusinessCaseByID,
			services.NewAuthorizeFetchBusinessCaseByID(),
		),
		services.NewCreateBusinessCase(
			serviceConfig,
			store.FetchSystemIntakeByID,
			services.NewAuthorizeCreateBusinessCase(s.logger),
			store.CreateBusinessCase,
		),
		services.NewUpdateBusinessCase(
			serviceConfig,
			store.FetchBusinessCaseByID,
			services.NewAuthorizeUpdateBusinessCase(s.logger),
			store.UpdateBusinessCase,
			emailClient.SendBusinessCaseSubmissionEmail,
		),
	)
	api.Handle("/business_case/{business_case_id}", businessCaseHandler.Handle())
	api.Handle("/business_case", businessCaseHandler.Handle())

	businessCasesHandler := handlers.NewBusinessCasesHandler(
		base,
		services.NewFetchBusinessCasesByEuaID(
			serviceConfig,
			store.FetchBusinessCasesByEuaID,
			services.NewAuthorizeFetchBusinessCasesByEuaID(),
		),
	)
	api.Handle("/business_cases", businessCasesHandler.Handle())

	metricsHandler := handlers.NewMetricsHandler(
		base,
		services.NewFetchMetrics(serviceConfig, store.FetchSystemIntakeMetrics),
	)
	api.Handle("/metrics", metricsHandler.Handle())

	s.router.PathPrefix("/").Handler(handlers.NewCatchAllHandler(
		base,
	).Handle())
}
