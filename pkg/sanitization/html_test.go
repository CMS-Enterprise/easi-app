package sanitization

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

type testSanitizeHTMLType struct {
	testCase       string
	input          string
	expectedOutput string
}

func TestSanitizeHTML(t *testing.T) {

	// TODO: add more test cases of expected filtered out results

	sanitizeHTMLTests := []testSanitizeHTMLType{
		{
			testCase:       "Sanitize HTML will remove script tags",
			input:          "<p><strong>Notification email</strong></p><script>This is a script that will be sanitized</script>",
			expectedOutput: "<p><strong>Notification email</strong></p>",
		},
		{
			testCase:       "Sanitize HTML will not modify plain text",
			input:          "This is my test string",
			expectedOutput: "This is my test string",
		},
	}

	for _, test := range sanitizeHTMLTests {
		t.Run(test.testCase, func(t *testing.T) {
			actualOutput := SanitizeHTML(test.input)
			assert.EqualValues(t, test.expectedOutput, actualOutput)
		})
	}

}
