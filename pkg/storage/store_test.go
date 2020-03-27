package storage

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type StoreTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestStoreTestSuite(t *testing.T) {
	storeTestSuite := &StoreTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}
	suite.Run(t, storeTestSuite)
}
