package services

import (
	"fmt"
	"testing"

	"github.com/facebookgo/clock"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

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
	store, err := storage.NewStore(logger, dbConfig, ldClient)
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

// tests can pass in a TestDataSource they initialize, then set feature flag values on it; these values will then be provided to service functions via Config
func newTestServicesConfig(td *ldtestdata.TestDataSource) Config {
	ldConfig := ld.Config{
		DataSource: td,
	}

	ldClient, err := ld.MakeCustomClient("fake", ldConfig, 0)
	if err != nil {
		panic("Error initializing mock LaunchDarkly client")
	}

	return Config{
		clock:    clock.NewMock(),
		ldClient: ldClient,
	}
}

func setBoolFeatureFlag(td *ldtestdata.TestDataSource, flagName string, value bool) {
	td.Update(td.Flag(flagName).BooleanFlag().VariationForAll(value))
}
