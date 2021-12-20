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
	return fmt.Sprintf("User is unauthorized: %s", e.Err)
}

// Unwrap provides the underlying error
func (e *UnauthorizedError) Unwrap() error {
	return e.Err
}

// QueryOperation provides a set of operations that can fail
type QueryOperation string

const (
	// QueryPost is for failures when creating a resource
	QueryPost QueryOperation = "Create"
	// QuerySave is for failures when saving
	QuerySave QueryOperation = "Save"
	// QueryFetch is for failures when getting a resource
	QueryFetch QueryOperation = "Fetch"
	// QueryUpdate is for failures when updating a resource
	QueryUpdate QueryOperation = "Update"
)

// QueryError is a typed error for query issues
type QueryError struct {
	Err       error
	Model     interface{}
	Operation QueryOperation
}

// Error provides the error as a string
func (e *QueryError) Error() string {
	return fmt.Sprintf("Could not query model %T with operation %s, received error: %s", e.Model, e.Operation, e.Err)
}

// Unwrap provides the underlying error
func (e *QueryError) Unwrap() error {
	return e.Err
}

// ResourceConflictError is for when a task can't be completed because of the resource state
type ResourceConflictError struct {
	Err        error
	Resource   interface{}
	ResourceID string
}

// Error provides the error as a string
func (e *ResourceConflictError) Error() string {
	return fmt.Sprintf("Could not perform action on %T %s with error: %s", e.Resource, e.ResourceID, e.Err)
}

// Unwrap provides the underlying error
func (e *ResourceConflictError) Unwrap() error {
	return e.Err
}

// Validations maps attributes to validation messages
type Validations map[string]string

// Map directly returns a map in case implementation of Validations changes
func (v Validations) Map() map[string]string {
	return v
}

// NewValidationError returns a validation error with fields instantiated
func NewValidationError(err error, model interface{}, modelID string) ValidationError {
	return ValidationError{
		Err:         err,
		Validations: Validations{},
		Model:       model,
		ModelID:     modelID,
	}
}

// ValidationError is a typed error for issues with validation
type ValidationError struct {
	Err         error
	Validations Validations
	Model       interface{}
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
	return fmt.Sprintf("Could not validate %T %s: %s", e.Model, e.ModelID, string(data))
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
	Model     interface{}
	ModelID   string
	Operation ExternalAPIOperation
	Source    string
}

// Error provides the error as a string
func (e *ExternalAPIError) Error() string {
	return fmt.Sprintf(
		"Could not hit %s for %T %s with operation %s, received error: %s",
		e.Source,
		e.Model,
		e.ModelID,
		e.Operation,
		e.Err,
	)
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

// MethodNotAllowedError is a typed error for an unsupported method
type MethodNotAllowedError struct {
	Method string
}

// Error provides the error as a string
func (e *MethodNotAllowedError) Error() string {
	return fmt.Sprintf(
		"Method %s not allowed",
		e.Method,
	)
}

// BadRequestError is a typed error for bad request content
type BadRequestError struct {
	Err error
}

// Error provides the error as a string
func (e *BadRequestError) Error() string {
	return fmt.Sprintf(
		"Request could not understood: %v",
		e.Err,
	)
}

// Unwrap provides the underlying error
func (e *BadRequestError) Unwrap() error {
	return e.Err
}

// UnknownRouteError is an error for unknown routes
type UnknownRouteError struct {
	Path string
}

// Error provides the error as a string
func (e *UnknownRouteError) Error() string {
	return fmt.Sprintf(
		"Route %s unknown",
		e.Path,
	)
}

// ResourceNotFoundError is a typed error non-existent resources
type ResourceNotFoundError struct {
	Err      error
	Resource interface{}
}

// Error provides the error as a string
func (e *ResourceNotFoundError) Error() string {
	return fmt.Sprintf(
		"Could not find resource %T with error: %v",
		e.Resource,
		e.Err,
	)
}

// Unwrap provides the underlying error
func (e *ResourceNotFoundError) Unwrap() error {
	return e.Err
}
