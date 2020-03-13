package server

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type ServerTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestServerTestSuite(t *testing.T) {
	serverTestSuite := &ServerTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}
	suite.Run(t, serverTestSuite)
}
