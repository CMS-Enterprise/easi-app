package appvalidation

import (
	"testing"

	"github.com/stretchr/testify/suite"
)

type AppValidateTestSuite struct {
	suite.Suite
}

func TestAppValidateTestSuite(t *testing.T) {
	testSuite := &AppValidateTestSuite{
		Suite: suite.Suite{},
	}

	suite.Run(t, testSuite)
}
