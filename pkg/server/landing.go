package server

import (
	"encoding/json"
	"net/http"
	"time"
)

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

func (s *server) handleLanding() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		_, err = w.Write(js)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
