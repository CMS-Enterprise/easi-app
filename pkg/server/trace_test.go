package server

import (
	"net/http"
	"net/http/httptest"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

func (s ServerTestSuite) TestTraceMiddleware() {
	traceValue := ""
	// this is the actual test, since the context is cancelled post request
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		traceID, ok := appcontext.Trace(r.Context())

		traceValue = traceID.String()
		s.True(ok)
		s.NotEqual(uuid.UUID{}, traceID)
	})

	req := httptest.NewRequest("GET", "/systems/", nil)
	rr := httptest.NewRecorder()
	middleware := NewTraceMiddleware(s.logger)

	middleware(testHandler).ServeHTTP(rr, req)

	// Ensure what is in the header matches what is on the context
	s.Equal(traceValue, rr.Header().Get(traceHeader))
}
