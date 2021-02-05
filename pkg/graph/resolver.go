package graph

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is a resolver.
type Resolver struct {
	store       *storage.Store
	systemsList func(ctx context.Context) ([]*models.System, error)
}

// NewResolver constructs a resolver
func NewResolver(
	store *storage.Store,
	systemsList func(ctx context.Context) ([]*models.System, error),
) *Resolver {
	return &Resolver{
		store:       store,
		systemsList: systemsList,
	}
}
