package storage

import (
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

// Store performs database operations for EASi
type Store struct {
	db     *sqlx.DB
	logger *zap.Logger
}

// NewStore is a constructor for a store
func NewStore(db *sqlx.DB, logger *zap.Logger) *Store {
	return &Store{db: db, logger: logger}
}
