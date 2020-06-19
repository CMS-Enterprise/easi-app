package handlers

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type HandlerTestSuite struct {
	suite.Suite
	logger *zap.Logger
	base   HandlerBase
}

func TestHandlerTestSuite(t *testing.T) {
	handlerTestSuite := &HandlerTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
		base:   NewHandlerBase(zap.NewNop()),
	}
	suite.Run(t, handlerTestSuite)
}
