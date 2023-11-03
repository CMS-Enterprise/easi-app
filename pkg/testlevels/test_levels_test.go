package testlevels

import (
	"testing"
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
