package storage

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// TransactionFunc defines the function signature needed to represent passing a transaction and returning a generic type
type TransactionFunc[T any] func(*sqlx.Tx) (*T, error)

// WithTransaction is a wrapper function which handles creating, committing or rollback a transaction
// If there are any errors when executing the txFunc, the tx is rolled back. Otherwise, the tx is committed.
func WithTransaction[T any](s *Store, txFunc TransactionFunc[T]) (*T, error) {
	tx, err := s.db.Beginx()
	if err != nil {
		return nil, fmt.Errorf("error creating transaction %w", err)
	}

	result, errFunc := txFunc(tx)
	if errFunc != nil {
		rollbackErr := tx.Rollback()
		if rollbackErr != nil {
			return nil, fmt.Errorf("issue rolling back transaction: %w", rollbackErr)
		}
		return nil, errFunc

	}

	err = tx.Commit()

	if err != nil {
		return nil, fmt.Errorf("issue committing transaction: %w", err)
	}

	return result, nil
}
