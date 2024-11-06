package models

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"html/template"
	"io"

	"github.com/cms-enterprise/easi-app/pkg/sanitization"
)

type TaggedHTML string

// ToTemplate converts and sanitizes the TaggedHTML type to a template.HTML struct
func (h *TaggedHTML) ToTemplate() template.HTML {
	if h == nil {
		return ""
	}

	sanitizedHTML := sanitization.SanitizeHTML(*h)
	return template.HTML(sanitizedHTML) //nolint //the html is sanitized again on the previous line so we can ignore the warning about
}

// ValueOrEmptyString returns either the value of the html or an empty string if nil
func (h *TaggedHTML) ValueOrEmptyString() string {
	if h != nil {
		return string(*h)
	}

	return ""
}

// ValueOrEmptyHTML returns either the value of the html or an empty TaggedHTML type if nil
func (h *TaggedHTML) ValueOrEmptyHTML() TaggedHTML {
	if h != nil {
		return *h
	}

	return ""
}

// StringPointer casts an TaggedHTML pointer to a string pointer
func (h *TaggedHTML) StringPointer() *string {
	return (*string)(h)
}

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTML type
func (h *TaggedHTML) UnmarshalGQLContext(ctx context.Context, v interface{}) error {

	// Check if the value is a string
	htmlString, ok := v.(string)
	if !ok {
		return errors.New("invalid TaggedHTML")
	}

	// Sanitize the TaggedHTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(htmlString)

	// Set the sanitized TaggedHTML value to the receiver
	*h = TaggedHTML(sanitizedHTMLString)

	return nil
}

// MarshalGQLContext marshals the TaggedHTML type to JSON to return to graphQL
func (h TaggedHTML) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	// TODO: Remove this hotfix that was introduced as a result of entities being rendered as escaped HTML in non-rich-text views
	// (Rich Text views handle this escaped data properly, so this hotfix is only needed until we implement rich text views across the board)
	// Note: We only really need to do this here, instead of ALSO doing it in email code because the encoded HTML is handled cleanly by the html/template package
	unescapedHTML := html.UnescapeString(string(h))

	// Marshal the TaggedHTML value to JSON so that it's properly escaped (wrapped in quotation marks)
	jsonValue, err := json.Marshal(unescapedHTML)
	if err != nil {
		return fmt.Errorf("failed to marshal TaggedHTML to JSON: %w", err)
	}

	// Write the JSON-encoded TaggedHTML value to the writer
	if _, err := w.Write(jsonValue); err != nil {
		return fmt.Errorf("failed to write TaggedHTML to writer: %w", err)
	}

	return nil
}
