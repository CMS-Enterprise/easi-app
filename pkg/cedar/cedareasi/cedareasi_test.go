package cedareasi

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
)

type CedarEasiTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestCedarEasiTestSuite(t *testing.T) {
	cedarEasiTestSuite := &CedarEasiTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewNop(),
	}
	suite.Run(t, cedarEasiTestSuite)
}
