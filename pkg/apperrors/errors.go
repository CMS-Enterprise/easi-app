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

// NotificationDestination is a type of destination for a notification
type NotificationDestination string

const (
	// DestinationEmail is for an error with an email notification
	DestinationEmail NotificationDestination = "Email"
)

// NotificationError is a typed error for when a notification fails
type NotificationError struct {
	Err         error
	Destination NotificationDestination
}

// Error is the error message for a notification error
func (e *NotificationError) Error() string {
	return fmt.Sprintf("Email error %s on destination %s", e.Err, e.Destination)
}
