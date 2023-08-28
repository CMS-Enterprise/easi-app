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
		expectedOutput: `<a href="https://dev.easi.cms.gov/" rel="nofollow noreferrer noopener" target="_blank">Valid link</a>`,
	}
	actualOutput := SanitizeHTML(testCase.input)
	assert.EqualValues(t, testCase.expectedOutput, actualOutput)

}
func TestSanitizeHTML(t *testing.T) {

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
			expectedOutput: `<a href="https://dev.easi.cms.gov/" rel="nofollow noreferrer noopener" target="_blank">Valid link</a> <p>InValid link</p>`,
		},
		{
			testCase:       "Sanitize HTML will not add no opener or target black to relative links",
			input:          `<a href="nonsense" rel="nofollow noreferrer noopener" target="_blank">Valid link</a>`,
			expectedOutput: `<a href="nonsense" rel="nofollow noreferrer">Valid link</a>`,
		},
		{
			testCase:       "Sanitize HTML will add security to rel attribute",
			input:          `<a href="https://dev.easi.cms.gov/">Valid link</a>`,
			expectedOutput: `<a href="https://dev.easi.cms.gov/" rel="nofollow noreferrer noopener" target="_blank">Valid link</a>`,
		},
		{
			testCase:       "Sanitize HTML will remove unknown tags",
			input:          `<wackyTag>This is an invalid tag</wackyTag>`,
			expectedOutput: `This is an invalid tag`,
		},
		{
			testCase:       "Sanitize HTML will allow tags p, br, strong, em, ol, ul, li, a",
			input:          `<p><strong>Notification email</strong></p><p>A <a href="asdasd" rel="nofollow noreferrer noopener" target="_blank">notification</a> email will be sent to the requester when you complete this action. If you would like, you may also send a copy to the TRB mailbox and/or to any additional attendees.</p><p>Choose recipients</p><ol><li><p>asd</p></li><li><p>asd</p></li><li><p>asdewg</p></li></ol><ul><li><p>Hello</p></li><li><p><em>;l;lk;kl;</em></p></li></ul>`,
			expectedOutput: `<p><strong>Notification email</strong></p><p>A <a href="asdasd" rel="nofollow noreferrer">notification</a> email will be sent to the requester when you complete this action. If you would like, you may also send a copy to the TRB mailbox and/or to any additional attendees.</p><p>Choose recipients</p><ol><li><p>asd</p></li><li><p>asd</p></li><li><p>asdewg</p></li></ol><ul><li><p>Hello</p></li><li><p><em>;l;lk;kl;</em></p></li></ul>`,
		},
	}

	for _, test := range sanitizeHTMLTests {
		t.Run(test.testCase, func(t *testing.T) {
			actualOutput := SanitizeHTML(test.input)
			assert.EqualValues(t, test.expectedOutput, actualOutput)
		})
	}

}
