package integration

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cmsgov/easi-app/pkg/server"
)

func TestHandleLanding(t *testing.T) {
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()

	handler := http.HandlerFunc(server.HandleLanding)

	handler.ServeHTTP(rr, req)

	if s := rr.Code; s != http.StatusOK {
		t.Errorf("handler returned %v, wanted %v", s, http.StatusOK)
	}

	if s := rr.Body.String(); s != "The EASi web app!" {
		t.Errorf("Incorrect response body. Got %v", rr.Body.String())
	}
}
