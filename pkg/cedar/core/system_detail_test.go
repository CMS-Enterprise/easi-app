package cedarcore

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseQuarterToRetireReplace(t *testing.T) {
	// Test cases
	tests := []struct {
		input    string
		expected string
	}{
		{input: "3 (Hint : July 1 - September 30)", expected: "3"},
		{input: "4 (Hint : October 1 - December 31)", expected: "4"},
		{input: "123", expected: "1"},
		{input: "-1 is a nubmer", expected: ""},
		{input: "0", expected: "0"},
		{input: "85", expected: "8"},
		{input: "9", expected: "9"},
		{input: "Weird input", expected: ""},
		{input: "", expected: ""},
	}

	// Run tests
	for _, test := range tests {
		result := parseQuarterToRetireReplace(test.input)
		assert.Equal(t, test.expected, result)
	}
}
