package sanitization

import (
	"sync"

	"github.com/microcosm-cc/bluemonday"
)

var (
	htmlInitOnce        sync.Once
	htmlSanitizerPolicy *bluemonday.Policy
)

// SanitizeHTML takes a string representation of HTML and sanitizes it
func SanitizeHTML[stringType ~string](input stringType) stringType {
	policy := getHTMLSanitizerPolicy()

	output := policy.Sanitize(string(input))

	return stringType(output)
}

func getHTMLSanitizerPolicy() *bluemonday.Policy {
	htmlInitOnce.Do(func() {
		htmlSanitizerPolicy = baseHTMLPolicy()
	})

	return htmlSanitizerPolicy
}

// baseHTMLPolicy instantiates the standard HTML sanitization policy for the EASI application
func baseHTMLPolicy() *bluemonday.Policy {

	policy := bluemonday.NewPolicy()
	// NOTE make sure to update the allowed policy on the frontend when it is updated here as well
	// This is set up in src/components/RichTextEditor/index.tsx as ALLOWED_TAGS in function sanitizeInput()
	policy.AllowElements("p", "br", "strong", "em", "ol", "ul", "li", "a")

	// Rules for links
	// if not included, this will be added to all links rel="nofollow noreferrer noopener"
	policy.AllowStandardURLs()
	policy.AllowAttrs("href").OnElements("a")
	policy.AllowRelativeURLs(false)
	policy.AddTargetBlankToFullyQualifiedLinks(true)
	policy.RequireNoReferrerOnLinks(true)
	return policy

}
