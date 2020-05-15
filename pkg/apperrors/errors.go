package apperrors

import (
	"encoding/json"
	"fmt"
)

// UnauthorizedError is a typed error for when authorization fails
type UnauthorizedError struct {
	Err error
}

// Error provides the error as a string
func (e *UnauthorizedError) Error() string {
	return "User is unauthorized"
}

// Unwrap provides the underlying error
func (e *UnauthorizedError) Unwrap() error {
	return e.Err
}

// QueryOperation provides a set of operations that can fail
type QueryOperation string

const (
	// QuerySave is for failures when saving
	QuerySave QueryOperation = "Save"
	// QueryFetch is for failures when getting a resource
	QueryFetch QueryOperation = "Fetch"
)

// QueryError is a typed error for query issues
type QueryError struct {
	Err       error
	Model     string
	Operation QueryOperation
}

// Error provides the error as a string
func (e *QueryError) Error() string {
	return fmt.Sprintf("Could not query model %s with operation %s", e.Model, e.Operation)
}

// Unwrap provides the underlying error
func (e *QueryError) Unwrap() error {
	return e.Err
}

// ResourceConflictError is for when a task can't be completed because of the resource state
type ResourceConflictError struct {
	Err        error
	Resource   string
	ResourceID string
}

// Error provides the error as a string
func (e *ResourceConflictError) Error() string {
	return fmt.Sprintf("Could not perform action on %s %s", e.Resource, e.ResourceID)
}

// Unwrap provides the underlying error
func (e *ResourceConflictError) Unwrap() error {
	return e.Err
}

// Validations maps attributes to validation messages
type Validations map[string]string

// ValidationError is a typed error for issues with validation
type ValidationError struct {
	Err         error
	Validations Validations
	Model       string
	ModelID     string
}

// WithValidation allows a failed validation message be added to the ValidationError
func (e ValidationError) WithValidation(key string, message string) {
	e.Validations[key] = message
}

// Error provides the error as a string
func (e *ValidationError) Error() string {
	data, err := json.Marshal(e.Validations)
	if err != nil {
		return err.Error()
	}
	return fmt.Sprintf("Could not validate %s %s: %s", e.Model, e.ModelID, string(data))
}

// Unwrap provides the underlying error
func (e *ValidationError) Unwrap() error {
	return e.Err
}

// ExternalAPIOperation provides a set of operations that can fail
type ExternalAPIOperation string

const (
	// Fetch is for failures when fetching data from an external source
	Fetch ExternalAPIOperation = "Fetch"
	// Submit is for failures when submitting to an external source
	Submit ExternalAPIOperation = "Submit"
)

// ExternalAPIError is a typed error for query issues
type ExternalAPIError struct {
	Err       error
	Model     string
	ModelID   string
	Operation ExternalAPIOperation
	Source    string
}

// Error provides the error as a string
func (e *ExternalAPIError) Error() string {
	return fmt.Sprintf("Could not hit %s for %s %s with operation %s", e.Source, e.Model, e.ModelID, e.Operation)
}

// Unwrap provides the underlying error
func (e *ExternalAPIError) Unwrap() error {
	return e.Err
}

// ContextOperation denotes what was happened when the context failed
type ContextOperation string

const (
	// ContextGet is for retrieving from the context
	ContextGet ContextOperation = "Get"
	// ContextSet is for adding to the context
	ContextSet ContextOperation = "Set"
)

// ContextError is a typed error for context issues
type ContextError struct {
	Operation ContextOperation
	Object    string
}

// Error provides the error as a string
func (e *ContextError) Error() string {
	return fmt.Sprintf("Could not %s %s on context", e.Operation, e.Object)
}

// NotificationDestinationType is a type of destination for a notification
type NotificationDestinationType string

const (
	// DestinationTypeEmail is for an error with an email notification
	DestinationTypeEmail NotificationDestinationType = "Email"
)

// NotificationError is a typed error for when a notification fails
type NotificationError struct {
	Err             error
	DestinationType NotificationDestinationType
}

// Error is the error message for a notification error
func (e *NotificationError) Error() string {
	return fmt.Sprintf("Email error '%s' on destination %s", e.Err, e.DestinationType)
}
