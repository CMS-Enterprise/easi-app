package storage

import (
	"fmt"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // required for postgres driver in sqlx
	"github.com/spf13/viper"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type StoreTestSuite struct {
	suite.Suite
	db          *sqlx.DB
	logger      *zap.Logger
	store       *Store
	environment string
}

func TestStoreTestSuite(t *testing.T) {
	config := viper.New()
	config.AutomaticEnv()

	dbUser := config.Get("PGUSER")
	sslMode := config.GetString("PG_SSL_MODE")
	db, err := sqlx.Connect(
		"postgres",
		fmt.Sprintf("user=%s sslmode=%s", dbUser, sslMode),
	)
	fmt.Println(err)
	logger := zap.NewNop()
	store := NewStore(db, logger)

	storeTestSuite := &StoreTestSuite{
		Suite:       suite.Suite{},
		db:          db,
		logger:      logger,
		store:       store,
		environment: config.GetString("ENVIRONMENT"),
	}
	suite.Run(t, storeTestSuite)
}
