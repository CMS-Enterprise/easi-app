package sanitization

import (
	"sync"

	"github.com/microcosm-cc/bluemonday"
)

var once sync.Once

var htmlSanitizerPolicy *bluemonday.Policy

// SanitizeHTML takes a string representation of HTML and sanitizes it
func SanitizeHTML(input string) (string, error) {
	policy := getHTMLSanitizerPolicy()

	output := policy.Sanitize(input)

	return output, nil
}

// getHTMLSanitizerPolicy returns the sanitization policy for HTML
func getHTMLSanitizerPolicy() *bluemonday.Policy {

	// once ensures that a policy is instantiated once. Otherwise, it is just retrieved.
	once.Do(func() {
		policy := bluemonday.NewPolicy()
		// NOTE make sure to update the allowed policy on the frontend when it is updated here as well
		// This is set up in src/components/RichTextEditor/index.tsx as ALLOWED_TAGS in function sanitizeHtmlOnContentChange()
		policy.AllowElements("p", "br", "strong", "em", "ol", "ul", "li", "a")

		// Rules for links
		policy.AllowStandardURLs()
		policy.AllowAttrs("href").OnElements("a")
		policy.AddTargetBlankToFullyQualifiedLinks(true)

		htmlSanitizerPolicy = policy
	})

	return htmlSanitizerPolicy
}
