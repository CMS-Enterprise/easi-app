package testlevels

import (
	"testing"

	"github.com/stretchr/testify/suite"
)

func TestUnitTest(t *testing.T) {
	UnitTest(t)

	t.Log("Running unit test")
}

func TestLocalIntegrationTest(t *testing.T) {
	LocalIntegrationTest(t)

	t.Log("Running local integration test")
}

func TestExternalIntegrationTest(t *testing.T) {
	ExternalIntegrationTest(t)

	t.Log("Running external integration test")
}

type IndependentTestSuite struct {
	suite.Suite
}

// check ability of test suite methods to be managed independently;
// a test suite method should be able to be skipped while still running the other tests
func TestLevelTestSuite(t *testing.T) {
	testSuite := &IndependentTestSuite{
		Suite: suite.Suite{},
	}

	suite.Run(t, testSuite)
}

func (s *IndependentTestSuite) TestUnitTest() {
	UnitTest(s.T())

	s.T().Log("Running unit test from suite")
}

func (s *IndependentTestSuite) TestLocalIntegrationTest() {
	LocalIntegrationTest(s.T())

	s.T().Log("Running local integration test from suite")
}

func (s *IndependentTestSuite) TestExternalIntegrationTest() {
	ExternalIntegrationTest(s.T())

	s.T().Log("Running external integration test from suite")
}

// check ability of test suite methods to be managed from within the suite entrypoint
// all these tests should be skipped or run as a single group
type GroupedTestSuite struct {
	suite.Suite
}

func TestGroupedTestSuite(t *testing.T) {
	// UnitTest(t)
	LocalIntegrationTest(t)

	testSuite := &GroupedTestSuite{
		Suite: suite.Suite{},
	}

	suite.Run(t, testSuite)
}

// even though this calls UnitTest(),
// this test should still be skipped based on the test level in TestGroupedTestSuite()
func (s *GroupedTestSuite) TestGroupedUnitTest() {
	UnitTest(s.T())

	s.T().Log("Running grouped unit test from suite")
}

func (s *GroupedTestSuite) TestGroupedLocalIntegrationTest() {
	LocalIntegrationTest(s.T())

	s.T().Log("Running grouped local integration test from suite")
}
