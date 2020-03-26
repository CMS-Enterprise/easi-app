package models

import (
	"testing"

	"github.com/stretchr/testify/suite"
)

type ModelTestSuite struct {
	suite.Suite
}

func TestModelTestSuite(t *testing.T) {
	testSuite := &ModelTestSuite{
		Suite: suite.Suite{},
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}
