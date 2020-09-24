package services

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

func makeDummySystemShort(id string, acronym string, name string) models.SystemShort {
	return models.SystemShort{
		ID:      id,
		Acronym: acronym,
		Name:    name,
	}
}

// NewFetchFakeSystems creates some fake systems TODO: deprecate in favor of CEDAR
func NewFetchFakeSystems() func(context.Context) (models.SystemShorts, error) {
	systems := models.SystemShorts{
		makeDummySystemShort("1", "GRPE", "Grape"),
		makeDummySystemShort("2", "APPL", "Apple"),
		makeDummySystemShort("3", "ORNG", "Orange"),
		makeDummySystemShort("4", "BNNA", "Banana"),
		makeDummySystemShort("5", "DRGN", "Dragonfruit"),
		makeDummySystemShort("6", "RMBT", "Rambutan"),
		makeDummySystemShort("7", "DURN", "Durian"),
		makeDummySystemShort("8", "LEMN", "Lemon"),
		makeDummySystemShort("9", "MNGO", "Mango"),
		makeDummySystemShort("10", "MGST", "Mangosteen"),
	}
	return func(_ context.Context) (models.SystemShorts, error) {
		return systems, nil
	}
}
