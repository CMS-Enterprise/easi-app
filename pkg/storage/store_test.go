package storage

import (
	"fmt"
	"testing"

	"github.com/facebookgo/clock"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // required for postgres driver in sqlx
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type StoreTestSuite struct {
	suite.Suite
	db     *sqlx.DB
	logger *zap.Logger
	store  *Store
}

func TestStoreTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	logger := zap.NewNop()
	dbConfig := DBConfig{
		Host:     config.GetString(appconfig.DBHostConfigKey),
		Port:     config.GetString(appconfig.DBPortConfigKey),
		Database: config.GetString(appconfig.DBNameConfigKey),
		Username: config.GetString(appconfig.DBUsernameConfigKey),
		Password: config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:  config.GetString(appconfig.DBSSLModeConfigKey),
	}
	store, err := NewStore(logger, dbConfig)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.Fail()
	}
	store.clock = clock.NewMock()

	storeTestSuite := &StoreTestSuite{
		Suite:  suite.Suite{},
		db:     store.db,
		logger: logger,
		store:  store,
	}

	suite.Run(t, storeTestSuite)
}
