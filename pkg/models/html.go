package models

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"

	"github.com/cmsgov/easi-app/pkg/sanitization"
)

// HTML represents html code. It is sanitized to only allow specific tags
type HTML string

// HTMLMarshaler is a custom marshaller for HTML type
type HTMLMarshaler struct {
	HTML HTML
}

// UnmarshalGQLContext unmarshals the data from graphql to the HTML type
func (html *HTML) UnmarshalGQLContext(ctx context.Context, v interface{}) error {

	// Check if the value is a string
	htmlString, ok := v.(string)
	if !ok {
		return errors.New("invalid HTML")
	}

	// Sanitize the HTML string
	sanitizedHTMLString, err := sanitization.SanitizeHTML(htmlString)
	if err != nil {
		return fmt.Errorf("issue sanitizing HTML: %w", err)
	}

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
