package storage

import "github.com/google/uuid"

type GetMappingID interface {
	GetMappingID() uuid.UUID
}

func oneIDtoMany[valT GetMappingID](keys []uuid.UUID, vals []valT) [][]valT {
	store := map[uuid.UUID][]valT{}

	// populate map
	for _, key := range keys {
		store[key] = []valT{}
	}

	for _, val := range vals {
		store[val.GetMappingID()] = append(store[val.GetMappingID()], val)
	}

	var out [][]valT
	for _, key := range keys {
		out = append(out, store[key])
	}

	return out
}
