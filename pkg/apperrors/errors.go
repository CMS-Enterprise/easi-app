package apperrors

import "fmt"

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

// ValidationError is a typed error for issues with validation
type ValidationError struct {
	Err     error
	Model   string
	ModelID string
}

// Error provides the error as a string
func (e *ValidationError) Error() string {
	return fmt.Sprintf("Could not hit validate %s %s", e.Model, e.ModelID)
}

// Unwrap provides the underlying error
func (e *ValidationError) Unwrap() error {
	return e.Err
}

// ExternalAPIOperation provides a set of operations that can fail
type ExternalAPIOperation string

const (
	// Validate is for failures when validating
	Validate ExternalAPIOperation = "Validate"
	// Submit is for failures when submitting
	Submit ExternalAPIOperation = "Submit"
)

// ExternalAPIError is a typed error for query issues
type ExternalAPIError struct {
	Err       error
	Model     string
	ModelID   string
	Operation ExternalAPIOperation
}

// Error provides the error as a string
func (e *ExternalAPIError) Error() string {
	return fmt.Sprintf("Could not hit CEDAR for %s %s with operation %s", e.Model, e.ModelID, e.Operation)
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
