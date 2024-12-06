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
		taggedHTMLPolicy = createTaggedHTMLPolicy()
	})

	return taggedHTMLPolicy
}

func createTaggedHTMLPolicy() *bluemonday.Policy {
	policy := bluemonday.NewPolicy()
	// rules for tags
	policy.AllowElements("span", "p")
	policy.AllowAttrs("data-type", "class", "tag-type", "data-id-db").OnElements("span")
	return policy
}
