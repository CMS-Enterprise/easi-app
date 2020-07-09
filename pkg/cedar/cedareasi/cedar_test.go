package cedareasi

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type CedarTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestCedarTestSuite(t *testing.T) {
	cedarTestSuite := &CedarTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}
	suite.Run(t, cedarTestSuite)
}
