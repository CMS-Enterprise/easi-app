package storage

import (
	"fmt"
	"testing"
	"time"

	"github.com/facebookgo/clock"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // required for postgres driver in sqlx
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type StoreTestSuite struct {
	suite.Suite
	db     *sqlx.DB
	logger *zap.Logger
	store  *Store
}

// EqualTime uses time.Time's Equal() to check for equality
// and wraps failures with useful error messages.
func (s StoreTestSuite) EqualTime(expected, actual time.Time) {
	if !actual.Equal(expected) {
		s.Failf("times were not equal", "expected %v, got %v", expected, actual)
	}
}

func (s StoreTestSuite) emptyDatabaseTables() error {
	statement := `
	DELETE FROM accessibility_request_status_records;
	DELETE FROM accessibility_request_notes;
	DELETE FROM accessibility_request_documents;
	DELETE FROM test_dates;
	DELETE FROM accessibility_requests;
	DELETE FROM notes;
	DELETE FROM actions;
	DELETE FROM estimated_lifecycle_costs;
	DELETE FROM business_cases;
	DELETE FROM grt_feedback;
	DELETE FROM system_intakes;
`
	_, err := s.db.Exec(statement)
	return err
}

func TestStoreTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	logger := zap.NewNop()
	dbConfig := DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	store, err := NewStore(logger, dbConfig, ldClient)
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
