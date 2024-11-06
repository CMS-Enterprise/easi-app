package storage

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"errors"
	"fmt"
	"net/url"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/rds/rdsutils"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

// iamDB is a custom struct that satisfies the driver.Connector so that it can be used with sql.OpenDB.
// It implements a custom Connect() function that will get a new IAM auth token for each connection.
type iamDB struct {
	config     DBConfig
	awsSession *session.Session
}

// Connect implements the functionality that is executed each time a new connection is made to the database
// For this reason, each new connection actually generates a new auth token, as each auth token only lasts 15 minutes
// Connections made with an auth token will _NOT_ drop when the token expires, so the 15 minute expiry should never matter
// This function helps satisfy the driver.Connector interface
func (idb *iamDB) Connect(ctx context.Context) (driver.Conn, error) {
	awsRegion := *idb.awsSession.Config.Region
	awsCreds := idb.awsSession.Config.Credentials
	dbEndpoint := fmt.Sprintf("%s:%s", idb.config.Host, idb.config.Port)

	authToken, err := rdsutils.BuildAuthToken(dbEndpoint, awsRegion, idb.config.Username, awsCreds)
	if err != nil {
		return nil, err
	}

	psqlURL := url.URL{
		Scheme: "postgres",
		Host:   dbEndpoint,
		User:   url.UserPassword(idb.config.Username, authToken),
		Path:   idb.config.Database,
	}

	q := psqlURL.Query()
	q.Add("sslmode", idb.config.SSLMode)

	psqlURL.RawQuery = q.Encode()

	psqlDriver := &pq.Driver{}
	connector, err := psqlDriver.Open(psqlURL.String())
	if err != nil {
		return nil, err
	}

	return connector, nil
}

// Driver returns IAM DB instance, as it satisfies the driver.Driver interface
// This function helps satisfy the driver.Connector interface
func (idb *iamDB) Driver() driver.Driver {
	return idb
}

// Open would normally return a new connection to the DB, but this custom IAM DB
// doesn't support it in favor of using `sql.OpenDB` in `newConnectionPoolWithIam`
// This function helps satisfy the driver.Driver interface
func (idb *iamDB) Open(name string) (driver.Conn, error) {
	return nil, errors.New("driver open method not supported")
}

// newConnectionPoolWithIam opens a sql.DB using the custom iamDb as a connector.
// It will wrap that sql.DB and return it as a *sqlx.DB
func newConnectionPoolWithIam(awsSession *session.Session, config DBConfig) *sqlx.DB {
	db := sql.OpenDB(&iamDB{config, awsSession})
	return sqlx.NewDb(db, "postgres")
}
