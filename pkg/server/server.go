// Package server is for setting up the server.
package server

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // pq is needed for the postgres driver
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/okta"
)

type server struct {
	router *mux.Router
	Config *viper.Viper
	logger *zap.Logger
	db     *sqlx.DB
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// Serve sets up the dependencies for a server and serves all the handlers
func Serve(config *viper.Viper) {
	// Set up logger first so we can use it
	zapLogger, err := zap.NewProduction()
	if err != nil {
		log.Fatal("Failed to initial logger.")
	}

	// Set the router
	r := mux.NewRouter()

	// TODO: We should add some sort of config verifier to make sure these configs exist
	// They may live in /cmd, but should fail quick on startup
	authMiddleware := okta.NewOktaAuthorizeMiddleware(
		zapLogger,
		config.GetString("OKTA_CLIENT_ID"),
		config.GetString("OKTA_ISSUER"),
	)
	
	// If we're local use override with local auth middleware
	if config.GetString("ENVIRONMENT") == "local" {
		authMiddleware = local.NewLocalAuthorizeMiddleware(zapLogger)
	}

	//Set up the database connection
	pgdsn := config.GetString("SQLX_POSTGRES_DSN")
	db, err := sqlx.Connect("postgres", pgdsn)
	if err != nil {
		zapLogger.Fatal("Failed to connect to db")
	}

	// set up server dependencies
	clientAddress := config.GetString("CLIENT_ADDRESS")

	s := &server{
		router: r,
		Config: config,
		logger: zapLogger,
		db:     db,
	}

	// set up routes
	s.routes(
		authMiddleware,
		newCORSMiddleware(clientAddress),
		NewTraceMiddleware(zapLogger),
		NewLoggerMiddleware(zapLogger))

	// start the server
	zapLogger.Info("Serving application on localhost:8080")
	err = http.ListenAndServe(":8080", s)
	if err != nil {
		zapLogger.Fatal("Failed to start server")
	}
}
