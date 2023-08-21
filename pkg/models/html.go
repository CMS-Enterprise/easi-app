package models

import (
	"errors"
	"fmt"

	"github.com/99designs/gqlgen/graphql"

	"github.com/cmsgov/easi-app/pkg/sanitization"
)

// HTML represents html code. It is sanitized to only allow specific tags
type HTML string

// MarshalHTML allows HTML to be marshalled by graphql
func MarshalHTML(html HTML) graphql.Marshaler {
	return graphql.MarshalString(string(html)) // this is returning the value to GQL
}

// UnmarshalHTML allows uuid to be unmarshalled by graphql
func UnmarshalHTML(v interface{}) (HTML, error) {
	htmlString, ok := v.(string)
	if !ok {
		return "", errors.New("invalid HTML")
	}
	sanitizedHTML, err := sanitization.SanitizeHTML(htmlString)
	if err != nil {
		return "", fmt.Errorf("issue sanitizing HTML ... %w", err)
	}
	return HTML(sanitizedHTML), nil
}
