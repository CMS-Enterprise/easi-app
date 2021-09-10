package services

import (
	"fmt"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type ServicesTestSuite struct {
	suite.Suite
	logger *zap.Logger
	store  *storage.Store
}

func TestServicesTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()
	logger := zap.NewNop()

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	store, err := storage.NewStore(logger, dbConfig, ldClient, false)
	if err != nil {
		t.Fail()
		fmt.Printf("Failed to connect to database: %v", err)
		return
	}
	servicesTestSuite := &ServicesTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		store:  store,
	}
	suite.Run(t, servicesTestSuite)
}
