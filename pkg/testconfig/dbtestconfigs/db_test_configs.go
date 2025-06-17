// Package dbtestconfigs provides helper functions for reusing db test code
package dbtestconfigs

import (
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

// NewDBCTestConfig returns a DBConfig struct with values from appconfig
func NewDBCTestConfig() storage.DBConfig {
	config := testhelpers.NewConfig()

	return storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
}

// NewTestStoreAndConfig returns a DB store and a DB config given an ldClient
func NewTestStoreAndConfig(ldClient *ld.LDClient) (storage.DBConfig, *storage.Store, error) {
	config := NewDBCTestConfig()
	store, err := storage.NewStore(config, ldClient)

	return config, store, err

}
