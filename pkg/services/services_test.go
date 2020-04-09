package services

import (
	"fmt"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type ServicesTestSuite struct {
	suite.Suite
	logger *zap.Logger
	store  *storage.Store
	db     *sqlx.DB
}

func TestServicesTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()
	logger := zap.NewNop()

	dbConfig := storage.DBConfig{
		Host:     config.GetString(appconfig.DBHostConfigKey),
		Port:     config.GetString(appconfig.DBPortConfigKey),
		Database: config.GetString(appconfig.DBNameConfigKey),
		Username: config.GetString(appconfig.DBUsernameConfigKey),
		Password: config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:  config.GetString(appconfig.DBSSLModeConfigKey),
	}
	store, err := storage.NewStore(logger, dbConfig)
	if err != nil {
		t.Fail()
		fmt.Printf("Failed to connect to database: %v", err)
	}
	servicesTestSuite := &ServicesTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		store:  store,
		db:     store.DB,
	}
	suite.Run(t, servicesTestSuite)
}
