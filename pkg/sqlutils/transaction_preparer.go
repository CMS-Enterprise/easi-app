package sqlutils

import "github.com/jmoiron/sqlx"

// TransactionPreparer is an interface used to initiate a sqlx.TX
type TransactionPreparer interface {
	Beginx() (*sqlx.Tx, error)
}
