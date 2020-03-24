package services

import (
	"fmt"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type ServicesTestSuite struct {
	suite.Suite
	logger *zap.Logger
	db     *sqlx.DB
}

func TestServicesTestSuite(t *testing.T) {
	db, err := sqlx.Connect("postgres", "user=postgres sslmode=disable")
	fmt.Println(err)
	servicesTestSuite := &ServicesTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
		db:     db,
	}
	suite.Run(t, servicesTestSuite)
}
