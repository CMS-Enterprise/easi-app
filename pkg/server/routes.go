package server

import (
	"net/http"

	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v4"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appses"
	"github.com/cmsgov/easi-app/pkg/appvalidation"
	"github.com/cmsgov/easi-app/pkg/cedar/cedareasi"
	"github.com/cmsgov/easi-app/pkg/cedar/cedarldap"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/local"
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
	var cedarEasiClient cedareasi.Client
	connectedCedarEasiClient := cedareasi.NewTranslatedClient(
		s.Config.GetString("CEDAR_API_URL"),
		s.Config.GetString("CEDAR_API_KEY"),
	)
	if s.environment.Deployed() {
		s.CheckCEDAREasiClientConnection(connectedCedarEasiClient)
	}
	if s.environment.Local() || s.environment.Test() {
		cedarEasiClient = local.NewCedarEasiClient(s.logger)
	} else {
		cedarEasiClient = connectedCedarEasiClient
	}

	var cedarLDAPClient cedarldap.Client
	cedarLDAPClient = cedarldap.NewTranslatedClient(
		s.Config.GetString("CEDAR_API_URL"),
		s.Config.GetString("CEDAR_API_KEY"),
	)
	if s.environment.Local() || s.environment.Test() {
		cedarLDAPClient = local.NewCedarLdapClient(s.logger)
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
	if s.environment.Local() || s.environment.Test() {
		localSender := local.NewSender(s.logger)
		emailClient, err = email.NewClient(emailConfig, localSender)
		if err != nil {
			s.logger.Fatal("Failed to create email client", zap.Error(err))
		}
	}

	if s.environment.Deployed() {
		s.CheckEmailClient(emailClient)
	}

	// set up FlagClient
	flagConfig := s.NewFlagConfig()
	var flagClient flags.FlagClient

	switch flagConfig.Source {
	case appconfig.FlagSourceLocal:
		defaultFlags := flags.FlagValues{"taskListLite": "true", "sandbox": "true"}
		flagClient = flags.NewLocalClient(defaultFlags)

	case appconfig.FlagSourceLaunchDarkly:
		client, clientErr := flags.NewLaunchDarklyClient(flagConfig)
		if clientErr != nil {
			s.logger.Fatal("Failed to connect to create flag client", zap.Error(clientErr))
		}
		flagClient = client
	}

	flagUser := ld.NewAnonymousUser(s.Config.GetString("LD_ENV_USER"))

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// add a request based logger
	api.Use(loggerMiddleware)

	// wrap with CORs
	api.Use(corsMiddleware)

	// protect all API routes with authorization middleware
	api.Use(authorizationMiddleware)

	serviceConfig := services.NewConfig(s.logger, flagClient)

	store, err := storage.NewStore(
		s.logger,
		s.NewDBConfig(),
	)
	if err != nil {
		s.logger.Fatal("Failed to connect to database", zap.Error(err))
	}

	// endpoint for flags list
	flagsHandler := handlers.NewFlagsHandler(base, flags.NewFetchFlags(), flagClient, flagUser)
	api.Handle("/flags", flagsHandler.Handle())

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
			cedarLDAPClient.FetchUserInfo,
			emailClient.SendSystemIntakeReviewEmail,
			services.NewUpdateDraftSystemIntake(
				serviceConfig,
				services.NewAuthorizeUserIsIntakeRequester(),
				store.UpdateSystemIntake,
			),
			!s.environment.Prod(),
		),
		services.NewFetchSystemIntakeByID(
			serviceConfig,
			store.FetchSystemIntakeByID,
			services.NewAuthorizeHasEASiRole(),
		),
		services.NewArchiveSystemIntake(
			serviceConfig,
			store.FetchSystemIntakeByID,
			store.UpdateSystemIntake,
			services.NewCloseBusinessCase(
				serviceConfig,
				store.FetchBusinessCaseByID,
				store.UpdateBusinessCase,
			),
			services.NewAuthorizeUserIsIntakeRequester(),
			emailClient.SendWithdrawRequestEmail,
		),
	)
	api.Handle("/system_intake/{intake_id}", systemIntakeHandler.Handle())
	api.Handle("/system_intake", systemIntakeHandler.Handle())

	systemIntakesHandler := handlers.NewSystemIntakesHandler(
		base,
		services.NewFetchSystemIntakes(
			serviceConfig,
			store.FetchSystemIntakesByEuaID,
			store.FetchSystemIntakes,
			store.FetchSystemIntakesByStatuses,
			services.NewAuthorizeHasEASiRole(),
		),
	)
	api.Handle("/system_intakes", systemIntakesHandler.Handle())

	businessCaseHandler := handlers.NewBusinessCaseHandler(
		base,
		services.NewFetchBusinessCaseByID(
			serviceConfig,
			store.FetchBusinessCaseByID,
			services.NewAuthorizeHasEASiRole(),
		),
		services.NewCreateBusinessCase(
			serviceConfig,
			store.FetchSystemIntakeByID,
			services.NewAuthorizeUserIsIntakeRequester(),
			store.CreateAction,
			cedarLDAPClient.FetchUserInfo,
			store.CreateBusinessCase,
			store.UpdateSystemIntake,
		),
		services.NewUpdateBusinessCase(
			serviceConfig,
			store.FetchBusinessCaseByID,
			services.NewAuthorizeUserIsBusinessCaseRequester(),
			store.UpdateBusinessCase,
		),
	)
	api.Handle("/business_case/{business_case_id}", businessCaseHandler.Handle())
	api.Handle("/business_case", businessCaseHandler.Handle())

	businessCasesHandler := handlers.NewBusinessCasesHandler(
		base,
		services.NewFetchBusinessCasesByEuaID(
			serviceConfig,
			store.FetchBusinessCasesByEuaID,
			services.NewAuthorizeHasEASiRole(),
		),
	)
	api.Handle("/business_cases", businessCasesHandler.Handle())

	metricsHandler := handlers.NewMetricsHandler(
		base,
		services.NewFetchMetrics(serviceConfig, store.FetchSystemIntakeMetrics),
	)
	api.Handle("/metrics", metricsHandler.Handle())

	systemIntakeActionHandler := handlers.NewSystemIntakeActionHandler(
		base,
		services.NewTakeAction(
			store.FetchSystemIntakeByID,
			map[models.ActionType]services.ActionExecuter{
				models.ActionTypeSUBMITINTAKE: services.NewSubmitSystemIntake(
					serviceConfig,
					services.NewAuthorizeUserIsIntakeRequester(),
					store.UpdateSystemIntake,
					cedarEasiClient.ValidateAndSubmitSystemIntake,
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeSubmissionEmail,
				),
				models.ActionTypeNOTITREQUEST: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusNOTITREQUEST,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					true,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypeNEEDBIZCASE: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusNEEDBIZCASE,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypeREADYFORGRT: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusREADYFORGRT,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypePROVIDEFEEDBACKNEEDBIZCASE: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusNEEDBIZCASE,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypeREADYFORGRB: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusREADYFORGRB,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypeISSUELCID: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusLCIDISSUED,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					true,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypeSUBMITBIZCASE: services.NewSubmitBusinessCase(
					serviceConfig,
					services.NewAuthorizeUserIsIntakeRequester(),
					store.FetchOpenBusinessCaseByIntakeID,
					appvalidation.BusinessCaseForSubmit,
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					store.UpdateSystemIntake,
					store.UpdateBusinessCase,
					emailClient.SendBusinessCaseSubmissionEmail,
					models.SystemIntakeStatusBIZCASEDRAFTSUBMITTED,
				),
				models.ActionTypeSUBMITFINALBIZCASE: services.NewSubmitBusinessCase(
					serviceConfig,
					services.NewAuthorizeUserIsIntakeRequester(),
					store.FetchOpenBusinessCaseByIntakeID,
					appvalidation.BusinessCaseForSubmit,
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					store.UpdateSystemIntake,
					store.UpdateBusinessCase,
					emailClient.SendBusinessCaseSubmissionEmail,
					models.SystemIntakeStatusBIZCASEFINALSUBMITTED,
				),
				models.ActionTypeBIZCASENEEDSCHANGES: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusBIZCASECHANGESNEEDED,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypePROVIDEFEEDBACKBIZCASENEEDSCHANGES: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusBIZCASECHANGESNEEDED,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypePROVIDEFEEDBACKBIZCASEFINAL: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusBIZCASEFINALNEEDED,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					false,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
				models.ActionTypeNOGOVERNANCENEEDED: services.NewTakeActionUpdateStatus(
					serviceConfig,
					models.SystemIntakeStatusNOGOVERNANCE,
					store.UpdateSystemIntake,
					services.NewAuthorizeRequireGRTJobCode(),
					store.CreateAction,
					cedarLDAPClient.FetchUserInfo,
					emailClient.SendSystemIntakeReviewEmail,
					true,
					services.NewCloseBusinessCase(
						serviceConfig,
						store.FetchBusinessCaseByID,
						store.UpdateBusinessCase,
					),
				),
			},
		),
	)
	api.Handle("/system_intake/{intake_id}/actions", systemIntakeActionHandler.Handle())

	systemIntakeLifecycleIDHandler := handlers.NewSystemIntakeLifecycleIDHandler(
		base,
		services.NewUpdateLifecycleFields(
			serviceConfig,
			services.NewAuthorizeRequireGRTJobCode(),
			store.FetchSystemIntakeByID,
			store.UpdateSystemIntake,
			store.GenerateLifecycleID,
		),
	)
	api.Handle("/system_intake/{intake_id}/lcid", systemIntakeLifecycleIDHandler.Handle())

	notesHandler := handlers.NewNotesHandler(
		base,
		services.NewFetchNotes(
			serviceConfig,
			store.FetchNotesBySystemIntakeID,
			services.NewAuthorizeRequireGRTJobCode(),
		),
		services.NewCreateNote(
			serviceConfig,
			store.CreateNote,
			services.NewAuthorizeRequireGRTJobCode(),
		),
	)
	api.Handle("/system_intake/{intake_id}/notes", notesHandler.Handle())

	s.router.PathPrefix("/").Handler(handlers.NewCatchAllHandler(
		base,
	).Handle())
}
