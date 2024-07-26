package server

import (
	"net/http"
	"net/http/httptest"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
)

func (s *ServerTestSuite) TestLoggerMiddleware() {
	s.Run("get a new logger with trace ID", func() {

		req := httptest.NewRequest("GET", "/systems/", nil)
		rr := httptest.NewRecorder()
		traceMiddleware := newTraceMiddleware()
		prodLogger, err := zap.NewProduction()
		s.NoError(err)
		env, err := appconfig.NewEnvironment("test")
		s.NoError(err)
		loggerMiddleware := newLoggerMiddleware(prodLogger, env)

		// this is the actual test, since the context is cancelled post request
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger := appcontext.ZLogger(r.Context())

			s.NotEqual(prodLogger, logger)
		})

		traceMiddleware(loggerMiddleware(testHandler)).ServeHTTP(rr, req)
	})

	s.Run("get a new logger with no trace ID", func() {

		req := httptest.NewRequest("GET", "/systems/", nil)
		rr := httptest.NewRecorder()
		// need a new logger, because no-op won't use options
		prodLogger, err := zap.NewProduction()
		s.NoError(err)
		env, err := appconfig.NewEnvironment("test")
		s.NoError(err)
		loggerMiddleware := newLoggerMiddleware(prodLogger, env)

		// this is the actual test, since the context is cancelled post request
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger := appcontext.ZLogger(r.Context())

			s.NotEqual(prodLogger, logger)
		})

		loggerMiddleware(testHandler).ServeHTTP(rr, req)
	})
}
