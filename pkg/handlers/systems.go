package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemsListHandler is the handler for listing systems
type SystemsListHandler struct {
}

// Handle creates dummy systems and writes them
func (h SystemsListHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		js, err := json.Marshal(makeDummySystems())
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

func makeDummySystem(acronym string, name string) models.System {
	return models.System{
		ID:      uuid.New(),
		Acronym: acronym,
		Name:    name,
		Description: name + " Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
			"sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad " +
			"minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea " +
			"commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit " +
			"esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non " +
			"proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		Datapoint1: name + " datapoint 1",
		Datapoint2: name + " datapoint 2",
		Datapoint3: name + " datapoint 3",
		Datapoint4: name + " datapoint 4",
	}
}

func makeDummySystems() models.Systems {
	return models.Systems{
		makeDummySystem("GRPE", "Grape"),
		makeDummySystem("APPL", "Apple"),
		makeDummySystem("ORNG", "Orange"),
		makeDummySystem("BNNA", "Banana"),
		makeDummySystem("DRGN", "Dragonfruit"),
		makeDummySystem("RMBT", "Rambutan"),
		makeDummySystem("DURN", "Durian"),
		makeDummySystem("LEMN", "Lemon"),
		makeDummySystem("MNGO", "Mango"),
		makeDummySystem("MGST", "Mangosteen"),
	}
}
