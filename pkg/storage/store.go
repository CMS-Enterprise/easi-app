package storage

import (
	"fmt"
	"time"

	"github.com/facebookgo/clock"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

// Store performs database operations for EASi
type Store struct {
	db        *sqlx.DB
	logger    *zap.Logger
	clock     clock.Clock
	easternTZ *time.Location
}

// DBConfig holds the configurations for a database connection
type DBConfig struct {
	Host     string
	Port     string
	Database string
	Username string
	Password string
	SSLMode  string
}

// NewStore is a constructor for a store
func NewStore(
	logger *zap.Logger,
	config DBConfig,
) (*Store, error) {
	// LifecycleIDs are generated based on Eastern Time
	tz, err := time.LoadLocation("America/New_York")
	if err != nil {
		return nil, err
	}

	dataSourceName := fmt.Sprintf(
		"host=%s port=%s user=%s "+
			"password=%s dbname=%s sslmode=disable",
		config.Host,
		config.Port,
		config.Username,
		config.Password,
		config.Database,
	)
	db, err := sqlx.Connect("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}
	return &Store{db: db, logger: logger, clock: clock.New(), easternTZ: tz}, nil
}
