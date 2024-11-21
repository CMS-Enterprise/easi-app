package sanitization

import (
	"sync"

	"github.com/microcosm-cc/bluemonday"
)

var (
	taggedHTMLInitOnce sync.Once
	taggedHTMLPolicy   *bluemonday.Policy
)

func SanitizeTaggedHTML[stringType ~string](input stringType) stringType {
	policy := getTaggedHTMLPolicy()

	output := policy.Sanitize(string(input))

	return stringType(output)
}

func getTaggedHTMLPolicy() *bluemonday.Policy {
	taggedHTMLInitOnce.Do(func() {
		taggedHTMLPolicy = withTaggedHTMLPolicy(baseHTMLPolicy())
	})

	return taggedHTMLPolicy
}

func withTaggedHTMLPolicy(policy *bluemonday.Policy) *bluemonday.Policy {
	// rules for tags
	policy.AllowElements("span")
	policy.AllowAttrs("data-type", "class", "tag-type", "data-id-db").OnElements("span")
	return policy
}
