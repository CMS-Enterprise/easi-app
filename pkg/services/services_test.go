package services

import (
	"fmt"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/storage"
)

type ServicesTestSuite struct {
	suite.Suite
	logger *zap.Logger
	store  *storage.Store
	db     *sqlx.DB
}

func TestServicesTestSuite(t *testing.T) {
	db, err := sqlx.Connect("postgres", "user=postgres sslmode=disable")
	fmt.Println(err)
	logger := zap.NewNop()
	store := storage.NewStore(db, logger)
	servicesTestSuite := &ServicesTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		store:  store,
		db:     db,
	}
	suite.Run(t, servicesTestSuite)
}
