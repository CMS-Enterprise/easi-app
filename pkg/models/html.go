package models

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"

	"github.com/cmsgov/easi-app/pkg/sanitization"
)

// HTML represents html code. It is sanitized to only allow specific tags
type HTML string

// TODO: if we don't need to use context, we might consider using template.HTML, this method is more explicit though

// ToTemplate converts the HTML type to a template.HTML struct
func (html HTML) ToTemplate() template.HTML {
	// TODO: should we do another sanitization pass at this point time to be safe?
	return template.HTML(html) //nolint //the html is sanitized when it is Unmarshaled
}

// ValueOrEmptyString returns either the value of the html or an empty string if nil
func (html *HTML) ValueOrEmptyString() string {
	if html != nil {
		return string(*html)
	}
	return ""
}

// ValueOrEmptyHTML returns either the value of the html or an empty HTML type if nil
func (html *HTML) ValueOrEmptyHTML() HTML {
	if html != nil {
		return *html
	}
	return ""
}

// StringPointer casts an HTML pointer to a string pointer
func (html *HTML) StringPointer() *string {
	return (*string)(html)
}

// UnmarshalGQLContext unmarshals the data from graphql to the HTML type
func (html *HTML) UnmarshalGQLContext(ctx context.Context, v interface{}) error {

	// Check if the value is a string
	htmlString, ok := v.(string)
	if !ok {
		return errors.New("invalid HTML")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(htmlString)

	// Set the sanitized HTML value to the receiver
	*html = HTML(sanitizedHTMLString)

	return nil
}

// MarshalGQLContext marshals the HTML type to JSON to return to graphQL
func (html HTML) MarshalGQLContext(ctx context.Context, w io.Writer) error {

	// Marshal the HTML value to JSON
	jsonValue, err := json.Marshal(html)
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
