package main

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func makeSystemIntakeGRBPresentationLinks(
	ctx context.Context,
	store *storage.Store,
	links *models.SystemIntakeGRBPresentationLinks,
) *models.SystemIntakeGRBPresentationLinks {
	data, err := store.SetSystemIntakeGRBPresentationLinks(ctx, links)
	if err != nil {
		panic(fmt.Errorf("problem making system intake presentation links in devdata: %w", err))
	}

	return data
}
