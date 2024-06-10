package helpers

import (
	"github.com/google/uuid"
)

// GetMappingID can be implemented so that it can use OneToMany below to map a flat list of values
// to a flat list of their relative keys
type GetMappingID interface {
	GetMappingID() uuid.UUID
}

// OneToMany takes a list of keys and a list of values which map one-to-many (key-to-value)
// ex: vals could be a list of contract numbers where more than one value has the same mapped ID
func OneToMany[valT GetMappingID](keys []uuid.UUID, vals []valT) [][]valT {
	store := map[uuid.UUID][]valT{}

	// populate map
	for _, key := range keys {
		store[key] = []valT{}
	}

	for _, val := range vals {
		id := val.GetMappingID()
		store[id] = append(store[id], val)
	}

	var out [][]valT
	for _, key := range keys {
		out = append(out, store[key])
	}

	return out
}
