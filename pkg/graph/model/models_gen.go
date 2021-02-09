// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"github.com/google/uuid"
)

// A document that belongs to an accessibility request
type AccessibilityRequestDocument struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// An edge of an AccessibilityRequestConnection
type AccessibilityRequestEdge struct {
	Cursor string                `json:"cursor"`
	Node   *AccessibilityRequest `json:"node"`
}

// A collection of AccessibilityRequests
type AccessibilityRequestsConnection struct {
	Edges      []*AccessibilityRequestEdge `json:"edges"`
	TotalCount int                         `json:"totalCount"`
}

// Parameters required to create an AccessibilityRequest
type CreateAccessibilityRequestInput struct {
	Name string `json:"name"`
}

// Result of CreateAccessibilityRequest
type CreateAccessibilityRequestPayload struct {
	AccessibilityRequest *AccessibilityRequest `json:"accessibilityRequest"`
	UserErrors           []*UserError          `json:"userErrors"`
}

// A system is derived from a system intake and represents a computer system managed by CMS
type System struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// UserError represents application-level errors that are the result of
// either user or application developer error.
type UserError struct {
	Message string   `json:"message"`
	Path    []string `json:"path"`
}
