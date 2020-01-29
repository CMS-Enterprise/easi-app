package services

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func makeDummySystemShort(acronym string, name string) models.SystemShort {
	return models.SystemShort{
		ID:      uuid.New(),
		Acronym: acronym,
		Name:    name,
	}
}

// NewFetchFakeSystems creates some fake systems TODO: deprecate in favor of CEDAR
func NewFetchFakeSystems() func() (models.SystemShorts, error) {
	systems := models.SystemShorts{
		makeDummySystemShort("GRPE", "Grape"),
		makeDummySystemShort("APPL", "Apple"),
		makeDummySystemShort("ORNG", "Orange"),
		makeDummySystemShort("BNNA", "Banana"),
		makeDummySystemShort("DRGN", "Dragonfruit"),
		makeDummySystemShort("RMBT", "Rambutan"),
		makeDummySystemShort("DURN", "Durian"),
		makeDummySystemShort("LEMN", "Lemon"),
		makeDummySystemShort("MNGO", "Mango"),
		makeDummySystemShort("MGST", "Mangosteen"),
	}
	return func() (models.SystemShorts, error) {
		return systems, nil
	}
}
