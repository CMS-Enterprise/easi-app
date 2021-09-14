// Package server is for setting up the server.
package server

import (
	"crypto/tls"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
)

// Server holds dependencies for running the EASi server
type Server struct {
	router      *mux.Router
	Config      *viper.Viper
	logger      *zap.Logger
	environment appconfig.Environment
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// NewServer sets up the dependencies for a server
func NewServer(config *viper.Viper) *Server {

	// Set environment from config
	environment, err := appconfig.NewEnvironment(config.GetString(appconfig.EnvironmentKey))
	if err != nil {
		log.Fatalf("Unable to set environment: %v", err)
	}

	var zapLogger *zap.Logger
	if environment.Dev() || environment.Local() {
		zapLogger, err = zap.NewDevelopment()
	} else {
		zapLogger, err = zap.NewProduction()
	}
	if err != nil {
		log.Fatalf("Failed to initial logger: %v", err)
	}

	// Set the router
	r := mux.NewRouter()

	// set up server dependencies
	clientAddress := config.GetString("CLIENT_ADDRESS")

	s := &Server{
		router:      r,
		Config:      config,
		logger:      zapLogger,
		environment: environment,
	}

	// set up routes
	s.routes(
		newCORSMiddleware(clientAddress),
		NewTraceMiddleware(zapLogger),
		NewLoggerMiddleware(zapLogger))

	return s
}

// Serve runs the server
func Serve(config *viper.Viper) {
	s := NewServer(config)

	useTLS := config.GetBool("USE_TLS")
	if useTLS {
		serverCert, err := tls.X509KeyPair([]byte(config.GetString("SERVER_CERT")), []byte(config.GetString("SERVER_KEY")))
		if err != nil {
			s.logger.Fatal("Failed to parse key pair", zap.Error(err))
		}
		srv := http.Server{
			Addr:    ":8443",
			Handler: s,
			TLSConfig: &tls.Config{
				Certificates: []tls.Certificate{serverCert},
				MinVersion:   tls.VersionTLS13,
			},
		}
		s.logger.Info("Serving application on port 8443")
		err = srv.ListenAndServeTLS("", "")
		if err != nil {
			s.logger.Fatal("Failed to start server on port 8443")
		}
	} else {
		srv := http.Server{
			Addr:    ":8080",
			Handler: s,
		}
		s.logger.Info("Serving application on port 8080")
		err := srv.ListenAndServe()
		if err != nil {
			s.logger.Fatal("Failed to start server on port 8080")
		}
	}
}
