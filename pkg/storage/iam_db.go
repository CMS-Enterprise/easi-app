package storage

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"errors"
	"fmt"
	"net/url"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/rds/auth"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

// iamDB is a custom struct that satisfies the driver.Connector so that it can be used with sql.OpenDB.
// It implements a custom Connect() function that will get a new IAM auth token for each connection.
type iamDB struct {
	dbConfig  DBConfig
	awsConfig aws.Config
}

// Connect implements the functionality that is executed each time a new connection is made to the database
// For this reason, each new connection actually generates a new auth token, as each auth token only lasts 15 minutes
// Connections made with an auth token will _NOT_ drop when the token expires, so the 15 minute expiry should never matter
// This function helps satisfy the driver.Connector interface
func (idb *iamDB) Connect(ctx context.Context) (driver.Conn, error) {
	awsRegion := idb.awsConfig.Region
	awsCreds := idb.awsConfig.Credentials
	dbEndpoint := fmt.Sprintf("%s:%s", idb.dbConfig.Host, idb.dbConfig.Port)

	authToken, err := auth.BuildAuthToken(ctx, dbEndpoint, awsRegion, idb.dbConfig.Username, awsCreds)
	if err != nil {
		return nil, err
	}

	psqlURL := url.URL{
		Scheme: "postgres",
		Host:   dbEndpoint,
		User:   url.UserPassword(idb.dbConfig.Username, authToken),
		Path:   idb.dbConfig.Database,
	}

	q := psqlURL.Query()
	q.Add("sslmode", idb.dbConfig.SSLMode)

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
func newConnectionPoolWithIam(awsConfig aws.Config, dbConfig DBConfig) *sqlx.DB {
	db := sql.OpenDB(&iamDB{dbConfig: dbConfig, awsConfig: awsConfig})
	return sqlx.NewDb(db, "postgres")
}
