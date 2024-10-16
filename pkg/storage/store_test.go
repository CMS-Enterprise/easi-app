package storage

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // required for postgres driver in sqlx
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

type StoreTestSuite struct {
	suite.Suite
	db        *sqlx.DB
	logger    *zap.Logger
	store     *Store
	Principal *authentication.EUAPrincipal
}

// EqualTime uses time.Time's Equal() to check for equality
// and wraps failures with useful error messages.
func (s *StoreTestSuite) EqualTime(expected, actual time.Time) {
	if !actual.Equal(expected) {
		s.Failf("times were not equal", "expected %v, got %v", expected, actual)
	}
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

	store, err := NewStore(dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.Fail()
	}
	princ := createTestPrincipal(store, "ANON")

	store.clock = clock.NewMock()

	storeTestSuite := &StoreTestSuite{
		Suite:     suite.Suite{},
		db:        store.db,
		logger:    logger,
		store:     store,
		Principal: princ,
	}

	suite.Run(t, storeTestSuite)
}

// utility function for testing TRB-related methods
func createTRBRequest(ctx context.Context, s *StoreTestSuite, createdBy string) uuid.UUID {
	//Note: this  only creates the TRB request, not the form or attendee. The business logic is called in the resolver, not the store method
	// resolvers.CreateTRBRequest(ctx,models.TRBTNeedHelp, s.store)

	trbRequest := models.NewTRBRequest(createdBy)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	createdRequest, err := s.store.CreateTRBRequest(ctx, s.store, trbRequest)
	s.NoError(err)

	return createdRequest.ID
}

// createTestPrincipal creates a test principal in the database. It bypasses a call to OKTA, and just creates mock data
func createTestPrincipal(store *Store, userName string) *authentication.EUAPrincipal {

	tAccount := authentication.UserAccount{
		Username:    userName,
		CommonName:  userName + "Doe",
		Locale:      "en_US",
		Email:       userName + "@local.cms.gov",
		GivenName:   userName,
		FamilyName:  "Doe",
		ZoneInfo:    "America/Los_Angeles",
		HasLoggedIn: true,
	}

	userAccount, _ := store.UserAccountCreate(context.Background(), store, &tAccount) //swallow error
	princ := &authentication.EUAPrincipal{
		EUAID:       userName,
		JobCodeEASi: true,
		JobCodeGRT:  true,
		UserAccount: userAccount,
	}
	return princ
}
