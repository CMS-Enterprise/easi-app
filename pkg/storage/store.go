package storage

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/facebookgo/clock"
	"github.com/jmoiron/sqlx"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// Store performs database operations for EASi
type Store struct {
	db        *sqlx.DB
	clock     clock.Clock
	easternTZ *time.Location
	ldClient  *ld.LDClient
}

// DBConfig holds the configurations for a database connection
type DBConfig struct {
	Host           string
	Port           string
	Database       string
	Username       string
	Password       string
	SSLMode        string
	UseIAM         bool
	MaxConnections int
}

// PrepareNamed implements the NamedPreparer interface
// Implementing the  sqlutils.NamedPreparer interface allows us to use a sqlx.Tx or a storage.Store as a parameter in our DB calls
// (the former for when we want to implement transactions, the latter for when we don't)
func (s *Store) PrepareNamed(query string) (*sqlx.NamedStmt, error) {
	return s.db.PrepareNamed(query)
}

// NamedExecContext implements the NamedPreparer interface
func (s *Store) NamedExecContext(ctx context.Context, sqlStatement string, arguments any) (sql.Result, error) {
	return s.db.NamedExecContext(ctx, sqlStatement, arguments)
}

// Beginx implements the TransactionPreparer interface
// Implementing the sqlutils.TransactionPreparer interfaces allows us to use a sqlx.DB or a storage.Store to create a transaction
func (s *Store) Beginx() (*sqlx.Tx, error) {
	return s.db.Beginx()
}

// NewStore creates a new Store struct
// The `db` property on the Store will always be a *sqlx.DB, but a notable difference in the DB is that if
// config.UseIAM is true, that DB instance will be backed by a custom connector in iam_db.go that generates
// IAM auth tokens when making new connections to the database.
// If config.UseIAM is false, it will connect using the "postgres" driver that SQLx registers in its init() function
// https://github.com/jmoiron/sqlx/blob/75a7ebf246fd757c9c7742da7dc4d26c6fdb6b5b/bind.go#L33-L40
func NewStore(
	config DBConfig,
	ldClient *ld.LDClient,
) (*Store, error) {
	// LifecycleIDs are generated based on Eastern Time
	tz, err := time.LoadLocation("America/New_York")
	if err != nil {
		return nil, err
	}

	var db *sqlx.DB
	if config.UseIAM {
		// Connect using the IAM DB package
		sess := session.Must(session.NewSession())
		db = newConnectionPoolWithIam(sess, config)
		err = db.Ping()
		if err != nil {
			return nil, err
		}
	} else {
		// Connect via normal user/pass
		dataSourceName := fmt.Sprintf(
			"host=%s port=%s user=%s "+
				"password=%s dbname=%s sslmode=%s",
			config.Host,
			config.Port,
			config.Username,
			config.Password,
			config.Database,
			config.SSLMode,
		)

		db, err = sqlx.Connect("postgres", dataSourceName)
		if err != nil {
			return nil, err
		}
	}

	db.SetMaxOpenConns(config.MaxConnections)

	return &Store{
		db:        db,
		clock:     clock.New(),
		easternTZ: tz,
		ldClient:  ldClient,
	}, nil
}

// args is a shortcut for passing an args map to a named statement
/* ex: instead of

map[string]interface{}{
  "system_id": 1,
  "state": OPEN
}

you can do

args{
  "system_id": 1,
  "state": OPEN
}
*/
type args map[string]any

// namedSelect is a shortcut for using `sqlx` Select (SelectContext) with named arguments to prevent writing out the prepare step each time
func namedSelect(ctx context.Context, np sqlutils.NamedPreparer, dest any, sqlStatement string, arguments any) error {
	if ctx == nil {
		ctx = context.TODO()
		appcontext.ZLogger(ctx).Debug("nil ctx passed to namedSelect")
	}

	stmt, err := np.PrepareNamed(sqlStatement)
	if err != nil {
		return err
	}
	defer stmt.Close()

	return stmt.SelectContext(ctx, dest, arguments)
}

// namedGet is a shortcut for using `sqlx` Get (GetContext) with named arguments to prevent writing out the prepare step each time
func namedGet(ctx context.Context, np sqlutils.NamedPreparer, dest any, sqlStatement string, arguments any) error {
	if ctx == nil {
		ctx = context.TODO()
		appcontext.ZLogger(ctx).Debug("nil ctx passed to namedGet")
	}

	stmt, err := np.PrepareNamed(sqlStatement)
	if err != nil {
		return err
	}
	defer stmt.Close()

	return stmt.GetContext(ctx, dest, arguments)
}

// namedExec is a shortcut for using `sqlx` Exec (ExecContext) with named arguments to prevent writing out the prepare step each time
func namedExec(ctx context.Context, np sqlutils.NamedPreparer, sqlStatement string, arguments any) (sql.Result, error) {
	if ctx == nil {
		ctx = context.TODO()
		appcontext.ZLogger(ctx).Debug("nil ctx passed to namedExec")
	}

	return np.NamedExecContext(ctx, sqlStatement, arguments)
}
