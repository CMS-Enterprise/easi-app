package storage

import (
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/credentials/stscreds"
	"github.com/aws/aws-sdk-go/aws/session"

	iampg "github.com/cmsgov/easi-app/pkg/iampostgres"

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
	if dbIamFlag {
		if sess != nil {
			// We want to get the credentials from the logged in AWS session rather than create directly,
			// because the session conflates the environment, shared, and container metadata config
			// within NewSession.  With stscreds, we use the Secure Token Service,
			// to assume the given role (that has rds db connect permissions).
			creds = stscreds.NewCredentials(sess, dbIamRoleArn)
		}
	}

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

		fmt.Printf("datasource name created")
		// Set a bogus password holder. It will be replaced with an RDS auth token as the password.
		passHolder := "*****"

		iampg.EnableIAM(config.Host,
			config.Port,
			"us-west-2",
			config.Username,
			passHolder,
			creds,
			iampg.RDSU{},
			time.NewTicker(10*time.Minute), // Refresh every 10 minutes
			logger,
			make(chan bool))

		config.Password = passHolder

		dataSourceName = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s",
			config.Host, config.Port, config.Username, config.Password, config.Database,
		)
	}

	db, err := sqlx.Connect(iampg.CustomPostgres, dataSourceName)
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
