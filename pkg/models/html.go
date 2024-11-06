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

// HTML represents html code. It is sanitized when unmarshaled from graphQL or when converted to HTML to only allow specific tags
type HTML string

// ToTemplate converts and sanitizes the HTML type to a template.HTML struct
func (h *HTML) ToTemplate() template.HTML {
	if h == nil {
		return template.HTML("")
	}
	sanitizedHTML := sanitization.SanitizeHTML(*h)
	return template.HTML(sanitizedHTML) //nolint //the html is sanitized again on the previous line so we can ignore the warning about
}

// ValueOrEmptyString returns either the value of the html or an empty string if nil
func (h *HTML) ValueOrEmptyString() string {
	if h != nil {
		return string(*h)
	}
	return ""
}

// ValueOrEmptyHTML returns either the value of the html or an empty HTML type if nil
func (h *HTML) ValueOrEmptyHTML() HTML {
	if h != nil {
		return *h
	}
	return ""
}

// StringPointer casts an HTML pointer to a string pointer
func (h *HTML) StringPointer() *string {
	return (*string)(h)
}

// UnmarshalGQLContext unmarshals the data from graphql to the HTML type
func (h *HTML) UnmarshalGQLContext(ctx context.Context, v interface{}) error {

	// Check if the value is a string
	htmlString, ok := v.(string)
	if !ok {
		return errors.New("invalid HTML")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(htmlString)

	// Set the sanitized HTML value to the receiver
	*h = HTML(sanitizedHTMLString)

	return nil
}

// MarshalGQLContext marshals the HTML type to JSON to return to graphQL
func (h HTML) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	// TODO: Remove this hotfix that was introduced as a result of entities being rendered as escaped HTML in non-rich-text views
	// (Rich Text views handle this escaped data properly, so this hotfix is only needed until we implement rich text views across the board)
	// Note: We only really need to do this here, instead of ALSO doing it in email code because the encoded HTML is handled cleanly by the html/template package
	unescapedHTML := html.UnescapeString(string(h))

	// Marshal the HTML value to JSON so that it's properly escaped (wrapped in quotation marks)
	jsonValue, err := json.Marshal(unescapedHTML)
	if err != nil {
		return fmt.Errorf("failed to marshal HTML to JSON: %w", err)
	}

	// Write the JSON-encoded HTML value to the writer
	_, err = w.Write(jsonValue)
	if err != nil {
		return fmt.Errorf("failed to write HTML to writer: %w", err)
	}

	return nil
}
