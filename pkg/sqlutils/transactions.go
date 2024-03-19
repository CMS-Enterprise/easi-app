// Package sqlutils contains functionality to wrap existing database functionality
package sqlutils

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

// WithTransactionRet is a wrapper function which handles creating, committing or rolling back a transaction
// If there are any errors when executing the txFunc, the tx is rolled back. Otherwise, the tx is committed.
func WithTransactionRet[T any](ctx context.Context, txPrep TransactionPreparer, txFunc func(*sqlx.Tx) (T, error)) (T, error) {
	var (
		result T
		logger = appcontext.ZLogger(ctx)
	)

	tx, err := txPrep.Beginx()
	if err != nil {
		return result, fmt.Errorf("error creating transaction %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			// we encountered a panic, attempt rollback
			if err := tx.Rollback(); err != nil {
				logger.Error("failed to rollback transaction after panic", zap.Error(err))
			}
			// continue panic sequence
			panic(p)
		} else if err != nil {
			// we hit an error in the `txFunc`, attempt rollback
			if err := tx.Rollback(); err != nil {
				logger.Error("failed to rollback transaction after error", zap.Error(err))
			}
		} else {
			// re-assign error here so it can be returned
			if err = tx.Commit(); err != nil {
				logger.Error("failed to commit transaction", zap.Error(err))
			}
		}
	}()

	result, err = txFunc(tx)
	// do not `return txFunc(tx)`
	// while `result` is assigned here, `err` is re-assigned in the deferred func above
	return result, err
}

func WithTransaction(ctx context.Context, txPrep TransactionPreparer, txFunc func(*sqlx.Tx) error) error {
	_, err := WithTransactionRet[any](ctx, txPrep, func(tx *sqlx.Tx) (any, error) {
		return nil, txFunc(tx)
	})

	return err
}
