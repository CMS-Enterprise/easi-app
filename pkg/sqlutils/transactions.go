// Package sqlutils contains functionality to wrap existing database functionality
package sqlutils

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

// WithTransactionRet is a wrapper function which handles creating, committing or rolling back a transaction
// If there are any errors when executing the txFunc, the tx is rolled back. Otherwise, the tx is committed.
func WithTransactionRet[T any](txPrep TransactionPreparer, txFunc func(*sqlx.Tx) (T, error)) (T, error) {
	var defaultT T
	tx, err := txPrep.Beginx()
	if err != nil {
		return defaultT, fmt.Errorf("error creating transaction %w", err)
	}

	result, errFunc := txFunc(tx)
	if errFunc != nil {
		rollbackErr := tx.Rollback()
		if rollbackErr != nil {
			return defaultT, fmt.Errorf("issue rolling back transaction: %w", rollbackErr)
		}
		return defaultT, errFunc

	}

	err = tx.Commit()

	if err != nil {
		return defaultT, fmt.Errorf("issue committing transaction: %w", err)
	}

	return result, nil
}

func WithTransaction(txPrep TransactionPreparer, txFunc func(*sqlx.Tx) error) error {
	_, err := WithTransactionRet[any](txPrep, func(tx *sqlx.Tx) (any, error) {
		return nil, txFunc(tx)
	})

	return err
}

// WithTransaction creates a new transaction and handles rollback/commit based on the
// error object returned by the `TxFn` or when it panics.
func WithTransaction2(ctx context.Context, db *sqlx.DB, txFunc func(*sqlx.Tx) error) error {
	tx, err := db.BeginTxx(ctx, &sql.TxOptions{
		Isolation: sql.LevelDefault,
		ReadOnly:  false,
	})
	if err != nil {
		return fmt.Errorf("cannot begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			err := tx.Rollback()
			if err != nil {
				return
			}
			panic(p)
		} else if err != nil {

			err := tx.Rollback()
			if err != nil {

				return
			}
		} else {
			err = tx.Commit()
			if err != nil {

				return
			}
		}
	}()

	err = txFunc(tx)
	return err
}
