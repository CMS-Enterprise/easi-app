package integration

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
)

func TestSystemsRoute(t *testing.T) {
	req, err := http.NewRequest("GET", "/systems/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()

	handlers.SystemsListHandler{}.Handle()(rr, req)

	if s := rr.Code; s != http.StatusOK {
		t.Errorf("handler returned %v, wanted %v", s, http.StatusOK)
	}

	var systems models.Systems
	err = json.Unmarshal(rr.Body.Bytes(), &systems)
	if len(systems) != 10 || systems[0].Acronym != "GRPE" || err != nil {
		t.Errorf("Wrong systems. Got %v", rr.Body.String())
	}
}
