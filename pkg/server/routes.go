package server

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/alerts"
	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/appses"
	"github.com/cmsgov/easi-app/pkg/appvalidation"
	"github.com/cmsgov/easi-app/pkg/authorization"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/oktaapi"
	"github.com/cmsgov/easi-app/pkg/usersearch"

	cedarcore "github.com/cmsgov/easi-app/pkg/cedar/core"
	cedarintake "github.com/cmsgov/easi-app/pkg/cedar/intake"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/graph"
	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/okta"
	"github.com/cmsgov/easi-app/pkg/services"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/upload"
)

func (s *Server) routes(
	corsMiddleware func(handler http.Handler) http.Handler,
	traceMiddleware func(handler http.Handler) http.Handler,
	loggerMiddleware func(handler http.Handler) http.Handler) {

	oktaConfig := s.NewOktaClientConfig()
	jwtVerifier := okta.NewJwtVerifier(oktaConfig.OktaClientID, oktaConfig.OktaIssuer)

	// set up Feature Flagging utilities
	ldClient, err := flags.NewLaunchDarklyClient(s.NewFlagConfig())
	if err != nil {
		s.logger.Fatal("Failed to create LaunchDarkly client", zap.Error(err))
	}
	store, storeErr := storage.NewStore(
		s.NewDBConfig(),
		ldClient,
	)
	if storeErr != nil {
		s.logger.Fatal("Failed to create store", zap.Error(storeErr))
	}

	oktaAuthenticationMiddleware := okta.NewOktaAuthenticationMiddleware(
		handlers.NewHandlerBase(),
		jwtVerifier,
		store,
		oktaConfig.AltJobCodes,
	)

	s.router.Use(
		traceMiddleware, // trace all requests with an ID
		loggerMiddleware,
		corsMiddleware,
		oktaAuthenticationMiddleware,
	)

	if s.NewLocalAuthIsEnabled() {
		localAuthenticationMiddleware := local.NewLocalAuthenticationMiddleware(store)
		s.router.Use(localAuthenticationMiddleware)
	}

	requirePrincipalMiddleware := authorization.NewRequirePrincipalMiddleware()

	// set up handler base
	base := handlers.NewHandlerBase()

	// endpoints that dont require authorization go directly on the main router
	s.router.HandleFunc("/api/v1/healthcheck", handlers.NewHealthCheckHandler(base, s.Config).Handle())
	s.router.HandleFunc("/api/graph/playground", playground.Handler("GraphQL playground", "/api/graph/query"))

	// set up CEDAR intake client
	publisher := cedarintake.NewClient(
		s.Config.GetString(appconfig.CEDARAPIURL),
		s.Config.GetString(appconfig.CEDARAPIKey),
		s.Config.GetBool(appconfig.CEDARIntakeEnabled),
	)
	if s.environment.Deployed() {
		s.NewCEDARClientCheck()
		if cerr := publisher.CheckConnection(context.Background()); cerr != nil {
			s.logger.Info("Non-Fatal - Failed to connect to CEDAR Intake API on startup", zap.Error(cerr))
		}
	}

	//TODO: update this to have OKTA API live in it's own package?
	var userSearchClient usersearch.Client
	if (!s.Config.GetBool(appconfig.OktaLocalEnabled) && s.environment.Local()) || s.environment.Test() {
		userSearchClient = local.NewOktaAPIClient()
	} else {
		// Create Okta API Client
		var oktaClientErr error
		// Ensure Okta API Variables are set
		s.NewOktaAPIClientCheck()
		userSearchClient, oktaClientErr = oktaapi.NewClient(s.Config.GetString(appconfig.OKTAAPIURL), s.Config.GetString(appconfig.OKTAAPIToken))
		if oktaClientErr != nil {
			s.logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
		}
	}

	var cedarCoreURL string
	if s.Config.GetBool(appconfig.CEDARCoreSkipProxy) {
		cedarCoreURL = s.Config.GetString(appconfig.CEDARAPIURL)
	} else {
		cedarCoreURL = s.Config.GetString(appconfig.CEDARPROXYURL)
	}

	// set up CEDAR core API client
	coreClient := cedarcore.NewClient(
		appcontext.WithLogger(context.Background(), s.logger),
		cedarCoreURL,
		s.Config.GetString(appconfig.CEDARAPIKey),
		s.Config.GetString(appconfig.CEDARCoreAPIVersion),
		s.Config.GetBool(appconfig.CEDARCoreSkipProxy),
		s.Config.GetBool(appconfig.CEDARCoreMock),
	)

	// set up Email Client
	sesConfig := s.NewSESConfig()
	sesSender := appses.NewSender(sesConfig)
	emailConfig := s.NewEmailConfig()
	emailClient, err := email.NewClient(emailConfig, sesSender)
	if err != nil {
		s.logger.Fatal("Failed to create email client", zap.Error(err))
	}

	// override email client to use MailCatcher when running locally
	if s.environment.Local() {
		smtpSender := local.NewSMTPSender("host.docker.internal:1025") // hardcoded for convenience, can be changed to depend on an environment variable if we need the flexibility
		emailClient, err = email.NewClient(emailConfig, smtpSender)
		if err != nil {
			s.logger.Fatal("Failed to create email client", zap.Error(err))
		}
	}

	// override email client with dummy client that logs output when running tests
	if s.environment.Test() {
		smtpSender := local.NewSMTPSender("email:1025") // TODO - get from environment variable?
		emailClient, err = email.NewClient(emailConfig, smtpSender)

		if err != nil {
			s.logger.Fatal("Failed to create email client", zap.Error(err))
		}
	}

	if s.environment.Deployed() {
		s.CheckEmailClient(emailClient)
	}

	// set up S3 client
	s3Config := s.NewS3Config()
	s3Config.IsLocal = s.environment.Local() || s.environment.Test()

	s3Client := upload.NewS3Client(s3Config)

	serviceConfig := services.NewConfig(s.logger, ldClient)

	// set up GraphQL routes
	gql := s.router.PathPrefix("/api/graph").Subrouter()

	gql.Use(requirePrincipalMiddleware)

	saveAction := services.NewSaveAction(
		store.CreateAction,
		userSearchClient.FetchUserInfo,
	)

	resolver := graph.NewResolver(
		store,
		graph.ResolverService{
			SubmitIntake: services.NewSubmitSystemIntake(
				serviceConfig,
				services.AuthorizeUserIsIntakeRequester,
				store.UpdateSystemIntake,
				// quick adapter to retrofit the new interface to take the place
				// of the old interface
				func(ctx context.Context, si *models.SystemIntake) (string, error) {
					err := publisher.PublishSystemIntake(ctx, *si)
					return "", err
				},
				saveAction,
				emailClient.SystemIntake.SendSubmitInitialFormRequesterNotification,
				emailClient.SystemIntake.SendSubmitInitialFormReviewerNotification,
			),
			FetchUserInfo:            userSearchClient.FetchUserInfo,
			FetchUserInfos:           userSearchClient.FetchUserInfos,
			SearchCommonNameContains: userSearchClient.SearchCommonNameContains,
		},
		&s3Client,
		&emailClient,
		ldClient,
		coreClient,
	)
	gqlDirectives := generated.DirectiveRoot{HasRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (res interface{}, err error) {
		hasRole, err := services.HasRole(ctx, role)
		if err != nil {
			return nil, err
		}
		if !hasRole {
			// don't need to log here - services.HasRole() handles logging
			return nil, &apperrors.UnauthorizedError{
				Err: fmt.Errorf("not authorized: user does not have role %v", role),
			}
		}
		return next(ctx)
	}}
	gqlConfig := generated.Config{Resolvers: resolver, Directives: gqlDirectives}
	graphqlServer := handler.NewDefaultServer(generated.NewExecutableSchema(gqlConfig))
	graphqlServer.Use(extension.FixedComplexityLimit(1000))
	graphqlServer.AroundResponses(NewGQLResponseMiddleware())

	dataLoaders := dataloaders.NewDataLoaders(store, userSearchClient.FetchUserInfos)
	dataLoaderMiddleware := dataloaders.NewDataLoaderMiddleware(dataLoaders)
	s.router.Use(dataLoaderMiddleware)

	gql.Handle("/query", graphqlServer)

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()
	api.Use(requirePrincipalMiddleware)

	systemIntakeHandler := handlers.NewSystemIntakeHandler(
		base,
		services.NewArchiveSystemIntake(
			serviceConfig,
			store.FetchSystemIntakeByID,
			store.UpdateSystemIntake,
			services.NewCloseBusinessCase(
				serviceConfig,
				store.FetchBusinessCaseByID,
				store.UpdateBusinessCase,
			),
			services.AuthorizeUserIsIntakeRequester,
			emailClient.SendWithdrawRequestEmail,
		),
	)
	api.Handle("/system_intake/{intake_id}", systemIntakeHandler.Handle())

	businessCaseHandler := handlers.NewBusinessCaseHandler(
		base,
		services.NewFetchBusinessCaseByID(
			serviceConfig,
			store.FetchBusinessCaseByID,
			services.AuthorizeHasEASiRole,
		),
		services.NewCreateBusinessCase(
			serviceConfig,
			store.FetchSystemIntakeByID,
			services.AuthorizeUserIsIntakeRequester,
			store.CreateAction,
			userSearchClient.FetchUserInfo,
			store.CreateBusinessCase,
			store.UpdateSystemIntake,
		),
		services.NewUpdateBusinessCase(
			serviceConfig,
			store.FetchBusinessCaseByID,
			services.AuthorizeUserIsBusinessCaseRequester,
			store.UpdateBusinessCase,
			store.FetchSystemIntakeByID,
			store.UpdateSystemIntake,
		),
	)
	api.Handle("/business_case/{business_case_id}", businessCaseHandler.Handle())
	api.Handle("/business_case", businessCaseHandler.Handle())

	metricsHandler := handlers.NewSystemIntakeMetricsHandler(
		base,
		services.NewFetchMetrics(
			serviceConfig,
			store.FetchSystemIntakeMetrics,
		),
	)
	api.Handle("/metrics", metricsHandler.Handle())

	actionHandler := handlers.NewActionHandler(
		base,
		services.NewTakeAction(
			store.FetchSystemIntakeByID,
			map[models.ActionType]services.ActionExecuter{
				models.ActionTypeSUBMITBIZCASE: services.NewSubmitBusinessCase(
					serviceConfig,
					services.AuthorizeUserIsIntakeRequester,
					store.FetchOpenBusinessCaseByIntakeID,
					appvalidation.BusinessCaseForSubmit,
					saveAction,
					store.UpdateSystemIntake,
					store.UpdateBusinessCase,
					emailClient.SystemIntake.SendSubmitBizCaseRequesterNotification,
					emailClient.SystemIntake.SendSubmitBizCaseReviewerNotification,
					publisher.PublishBusinessCase,
				),
				models.ActionTypeSUBMITFINALBIZCASE: services.NewSubmitBusinessCase(
					serviceConfig,
					services.AuthorizeUserIsIntakeRequester,
					store.FetchOpenBusinessCaseByIntakeID,
					appvalidation.BusinessCaseForSubmit,
					saveAction,
					store.UpdateSystemIntake,
					store.UpdateBusinessCase,
					emailClient.SystemIntake.SendSubmitBizCaseRequesterNotification,
					emailClient.SystemIntake.SendSubmitBizCaseReviewerNotification,
					publisher.PublishBusinessCase,
				), models.ActionTypeSUBMITINTAKE: services.NewSubmitSystemIntake(
					serviceConfig,
					services.AuthorizeUserIsIntakeRequester,
					store.UpdateSystemIntake,
					// quick adapter to retrofit the new interface to take the place
					// of the old interface
					func(ctx context.Context, si *models.SystemIntake) (string, error) {
						err := publisher.PublishSystemIntake(ctx, *si)
						return "", err
					},
					saveAction,
					emailClient.SystemIntake.SendSubmitInitialFormRequesterNotification,
					emailClient.SystemIntake.SendSubmitInitialFormReviewerNotification,
				),
			},
		),
	)
	api.Handle("/system_intake/{intake_id}/actions", actionHandler.Handle())

	s.router.PathPrefix("/").Handler(handlers.NewCatchAllHandler(
		base,
	).Handle())

	if ok, _ := strconv.ParseBool(os.Getenv("DEBUG_ROUTES")); ok {
		// useful for debugging route issues
		_ = s.router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
			pathTemplate, err := route.GetPathTemplate()
			if err == nil {
				fmt.Println("ROUTE:", pathTemplate)
			}
			pathRegexp, err := route.GetPathRegexp()
			if err == nil {
				fmt.Println("Path regexp:", pathRegexp)
			}
			queriesTemplates, err := route.GetQueriesTemplates()
			if err == nil {
				fmt.Println("Queries templates:", strings.Join(queriesTemplates, ","))
			}
			queriesRegexps, err := route.GetQueriesRegexp()
			if err == nil {
				fmt.Println("Queries regexps:", strings.Join(queriesRegexps, ","))
			}
			methods, err := route.GetMethods()
			if err == nil {
				fmt.Println("Methods:", strings.Join(methods, ","))
			}
			fmt.Println()
			return nil
		})
	}

	// This is a temporary solution for EASI-2597 until a more robust event scheduling solution is implemented

	// Check for upcoming LCID expirations every 24 hours
	alerts.StartLcidExpirationCheck(
		appcontext.WithLogger(context.Background(), s.logger),
		userSearchClient.FetchUserInfo,
		store.FetchSystemIntakes,
		store.UpdateSystemIntake,
		emailClient.SendLCIDExpirationAlertEmail,
		time.Hour*24)

}
