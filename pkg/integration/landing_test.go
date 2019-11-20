package integration

import (
	"encoding/json"
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

	var profile server.Profile
	err = json.Unmarshal(rr.Body.Bytes(), &profile)
	if profile.Name != "My Favorite Project" || err != nil {
		t.Errorf("Incorrect response body. Got %v", rr.Body.String())
	}
}
