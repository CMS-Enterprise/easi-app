package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	// Need blank import to connect to db. TODO delete this.
	_ "github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/cedar"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *server) routes(
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
		fmt.Println(err)
	}

	tx := db.MustBegin()
	_, _ = tx.NamedExec("INSERT INTO system_intake (id, eua_user_id, requester, component) VALUES (:id, :eua_user_id, :requester, :component)", &models.SystemIntake{ID: uuid.New(), EUAUserID: "sample", Requester: "test", Component: "test"})
	_ = tx.Commit()
	rows := models.SystemIntakes{}
	_ = db.Select(&rows, "SELECT eua_user_id FROM system_intake")
	byteArray, _ := json.Marshal(rows)
	fmt.Println(string(byteArray))

	// endpoint for system list
	systemHandler := handlers.SystemsListHandler{
		FetchSystems: cedarClient.FetchSystems,
		Logger:       s.logger,
	}
	api.Handle("/systems", systemHandler.Handle())
}
