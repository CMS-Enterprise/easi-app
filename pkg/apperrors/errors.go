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

// QueryError is a typed error for query issues
type QueryError struct {
	Err       error
	Model     string
	Operation string
}

// Error provides the error as a string
func (e *QueryError) Error() string {
	return fmt.Sprintf("Could not query model %s with operation %s", e.Model, e.Operation)
}

// Unwrap provides the underlying error
func (e *QueryError) Unwrap() error {
	return e.Err
}
