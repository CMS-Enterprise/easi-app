package storage

import "github.com/jmoiron/sqlx"

// NamedPreparer is an interface used by to execute a sqlx transaction either directly or as a transaction.
type NamedPreparer interface {
	PrepareNamed(query string) (*sqlx.NamedStmt, error)
}
