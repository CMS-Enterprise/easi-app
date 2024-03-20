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

	// `txErr` will track any errors that take place in the transaction execution itself
	var txErr error

	defer func() {
		if p := recover(); p != nil {
			// if `p` is not nil, it means we panicked at some point in the `txFunc`
			// attempt rollback
			if err := tx.Rollback(); err != nil {
				logger.Error("failed to rollback transaction after panic", zap.Error(err))
			}

			// continue panic sequence
			panic(p)

		} else if txErr != nil {
			// if `txErr` is not `nil`, then we know `txFunc` returned an error
			// attempt rollback
			if err := tx.Rollback(); err != nil {
				logger.Error("failed to rollback transaction after error", zap.Error(err))
			}

		} else {
			// no panic, and `txFunc` did not error, so we can commit the `tx`

			// explicitly re-assign `txErr` here so it can be returned
			// we must re-use `txErr` here as this defer function will re-assign `txErr` just before the outside function returns
			txErr = tx.Commit()
		}
	}()

	// use `txErr` here so the deferred func can use its updated value (such as a non-nil error)
	result, txErr = txFunc(tx)

	// do not `return txFunc(tx)`
	// while `result` is assigned above, `txErr` can be re-assigned in the deferred func above
	return result, txErr
}

func WithTransaction(ctx context.Context, txPrep TransactionPreparer, txFunc func(*sqlx.Tx) error) error {
	_, err := WithTransactionRet[any](ctx, txPrep, func(tx *sqlx.Tx) (any, error) {
		return nil, txFunc(tx)
	})

	return err
}
