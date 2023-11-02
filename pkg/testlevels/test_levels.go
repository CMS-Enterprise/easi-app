package testhelpers

import (
	"testing"

	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

// TestLevelConfigKey is the name of the environment variable used for determining the level of tests to run
// it's not in pkg/appconfig/config.go because it's *only* used for testing
const TestLevelConfigKey = "TEST_LEVEL"

type testLevel string

const (
	testLevelUnit                testLevel = "UNIT"
	testLevelLocalIntegration    testLevel = "LOCAL_INTEGRATION"
	testLevelExternalIntegration testLevel = "EXTERNAL_INTEGRATION"
)

func getTestLevel(t *testing.T) testLevel {
	config := testhelpers.NewConfig()
	testLevelValue := config.GetString(TestLevelConfigKey)
	switch testLevelValue {
	case string(testLevelUnit):
		return testLevelUnit
	case string(testLevelLocalIntegration):
		return testLevelLocalIntegration
	case string(testLevelExternalIntegration):
		return testLevelExternalIntegration
	default:
		t.Fatalf("unknown test level: %s", testLevelValue)
	}

	// this line shouldn't be reached, t.Fatalf() should exit the test, but it's necessary for this function to typecheck
	return ""
}

// UnitTest marks a unit test that can always be run, that doesn't require that the backend or database is running
func UnitTest(_ *testing.T) {
	// intentional no-op - test should always run
	// *testing.T parameter is only there for consistency with the other test level functions
}

// LocalIntegrationTest marks an integration test that requires running the backend and database, but no other external dependencies
func LocalIntegrationTest(t *testing.T) {
	testLevel := getTestLevel(t)
	if testLevel != testLevelLocalIntegration && testLevel != testLevelExternalIntegration {
		t.SkipNow()
	}
}

// ExternalIntegrationTest marks an integration test that requires external dependencies, such as Okta
func ExternalIntegrationTest(t *testing.T) {
	testLevel := getTestLevel(t)
	if testLevel != testLevelExternalIntegration {
		t.SkipNow()
	}
}
