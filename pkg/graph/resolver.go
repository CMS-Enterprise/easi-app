package graph

import (
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/upload"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is a resolver.
type Resolver struct {
	store    *storage.Store
	s3Client *upload.S3Client
}

// NewResolver constructs a resolver
func NewResolver(store *storage.Store, s3Client *upload.S3Client) *Resolver {
	return &Resolver{store: store, s3Client: s3Client}
}
