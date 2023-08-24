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

func TestDevelopmentHTML(t *testing.T) {
	testCase := testSanitizeHTMLType{
		testCase:       "Development",
		input:          `<a href="https://dev.easi.cms.gov/">Valid link</a>`,
		expectedOutput: `<a href="https://dev.easi.cms.gov/" rel="nofollow noopener" target="_blank">Valid link</a>`,
	}
	actualOutput := SanitizeHTML(testCase.input)
	assert.EqualValues(t, testCase.expectedOutput, actualOutput)

}
func TestSanitizeHTML(t *testing.T) {

	// TODO: add more test cases of expected filtered out results.
	// TODO: use escape string notation instead of escaping the response? ``

	sanitizeHTMLTests := []testSanitizeHTMLType{
		{
			testCase:       "Sanitize HTML will remove script tags",
			input:          `<p><strong>Notification email</strong></p><script>This is a script that will be sanitized</script>`,
			expectedOutput: `<p><strong>Notification email</strong></p>`,
		},
		{
			testCase:       "Sanitize HTML will not modify plain text",
			input:          "This is my test string",
			expectedOutput: "This is my test string",
		},
		{
			testCase:       "Sanitize HTML will remove allow href except on A tags",
			input:          `<a href="https://dev.easi.cms.gov/" rel="nofollow">Valid link</a> <p href="https://dev.easi.cms.gov/" rel="nofollow">InValid link</p>`,
			expectedOutput: `<a href="https://dev.easi.cms.gov/" rel="nofollow noopener" target="_blank">Valid link</a> <p>InValid link</p>`,
		},
		{
			testCase:       "Sanitize HTML will add security to rel attribute", //TODO, should we consider including a noreferrer value as well?
			input:          `<a href="https://dev.easi.cms.gov/">Valid link</a>`,
			expectedOutput: `<a href="https://dev.easi.cms.gov/" rel="nofollow noopener" target="_blank">Valid link</a>`,
		},
	}

	for _, test := range sanitizeHTMLTests {
		t.Run(test.testCase, func(t *testing.T) {
			actualOutput := SanitizeHTML(test.input)
			assert.EqualValues(t, test.expectedOutput, actualOutput)
		})
	}

}
