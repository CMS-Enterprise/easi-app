package storage

import (
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/credentials/stscreds"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/rds/rdsutils"

	"github.com/facebookgo/clock"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// Store performs database operations for EASi
type Store struct {
	db        *sqlx.DB
	logger    *zap.Logger
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
	MaxConnections int
}

// NewStore is a constructor for a store
func NewStore(
	logger *zap.Logger,
	config DBConfig,
	ldClient *ld.LDClient,
	dbIamFlag bool,
	dbIamRoleArn string,
) (*Store, error) {
	// LifecycleIDs are generated based on Eastern Time
	tz, err := time.LoadLocation("America/New_York")
	if err != nil {
		return nil, err
	}

	var sess *session.Session
	if dbIamFlag {
		sess = session.Must(session.NewSession())
	}

	var creds *credentials.Credentials

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

	if dbIamFlag {
		config.Username = "app_user_iam"
		if sess != nil {
			// We want to get the credentials from the logged in AWS session rather than create directly,
			// because the session conflates the environment, shared, and container metadata config
			// within NewSession.  With stscreds, we use the Secure Token Service,
			// to assume the given role (that has rds db connect permissions).
			creds = stscreds.NewCredentials(sess, dbIamRoleArn)
		}
		dbEndpoint := fmt.Sprintf("%s:%s", config.Host, config.Port)
		authToken, err := rdsutils.BuildAuthToken(dbEndpoint, "us-west-2", config.Username, creds)
		if err != nil {
			log.Fatalf("failed to build auth token %v", err)
		}

		dataSourceName = fmt.Sprintf("%s:%s@tcp(%s)/%s?tls=true&allowCleartextPasswords=true",
			config.Username, authToken, dbEndpoint, config.Database,
		)

	}

	db, err := sqlx.Connect("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(config.MaxConnections)

	return &Store{
		db:        db,
		logger:    logger,
		clock:     clock.New(),
		easternTZ: tz,
		ldClient:  ldClient,
	}, nil
}
