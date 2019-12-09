package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type LandingHandler struct {
}

type status string

const (
	draft status = "DRAFT"
)

// Profile is a simple struct for testing the API
type Profile struct {
	Name         string
	SystemOwners []string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Status       status
}

// HandleLanding is the handler for the root path
func (h LandingHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	sampleProfile := Profile{
		Name:         "My Favorite Project",
		SystemOwners: []string{"admin@example.com", "operations@example.com"},
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		Status:       draft,
	}
	js, err := json.Marshal(sampleProfile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	enableCors(&w)

	_, err = w.Write(js)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-fake-header")
}
