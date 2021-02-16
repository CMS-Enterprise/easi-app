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
	store   *storage.Store
	service ResolverService
}

// ResolverService holds service methods for use in resolvers
type ResolverService struct {
	CreateTestDate func(context.Context, *models.TestDate) (*models.TestDate, error)
}

// NewResolver constructs a resolver
func NewResolver(
	store *storage.Store,
	service ResolverService,
) *Resolver {
	return &Resolver{store: store, service: service}
}
