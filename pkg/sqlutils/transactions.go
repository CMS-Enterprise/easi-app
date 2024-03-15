// Package sqlutils contains functionality to wrap existing database functionality
package sqlutils

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// WithTransactionRet is a wrapper function which handles creating, committing or rolling back a transaction
// If there are any errors when executing the txFunc, the tx is rolled back. Otherwise, the tx is committed.
func WithTransactionRet[T any](txPrep TransactionPreparer, txFunc func(*sqlx.Tx) (*T, error)) (*T, error) {
	tx, err := txPrep.Beginx()
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

func WithTransaction(txPrep TransactionPreparer, txFunc func(*sqlx.Tx) error) error {
	_, err := WithTransactionRet[any](txPrep, func(tx *sqlx.Tx) (*any, error) {
		return nil, txFunc(tx)
	})

	return err
}
