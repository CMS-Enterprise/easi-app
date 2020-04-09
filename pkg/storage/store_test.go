package storage

import (
	"fmt"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // required for postgres driver in sqlx
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

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
		Suite:  suite.Suite{},
		db:     db,
		logger: logger,
		store:  store,
	}

	suite.Run(t, storeTestSuite)
}
