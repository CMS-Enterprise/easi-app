package sqlutils

import (
	"fmt"

	"github.com/lib/pq"
)

/********************
* //Future Enhancement:
* Add more errors here when needed to handle specific errors later in the app code.
********************/

// ErrDuplicateConstraint is a pointer to the errDupConstraint error, which can be used to verify if an error is of this specific type.
var ErrDuplicateConstraint *errDupConstraint

// errDupConstraint is a custom error type for unique constraint violations that wraps the original pq error.
type errDupConstraint struct {
	baseDBError
}

// newErrDupConstraintErr is a constructor to be used when a pq error occurs because of a duplicate value error.
func newErrDupConstraintErr(message string, pqErr *pq.Error) *errDupConstraint {
	return &errDupConstraint{
		baseDBError: newBaseDBError(message, pqErr),
	}

}

// newBaseDBError is a constructor for the base db error.
func newBaseDBError(message string, pqErr *pq.Error) baseDBError {
	return baseDBError{
		Message:       message,
		OriginalError: pqErr,
	}

}

// baseDBError is the base type shared by all errors in the sqlutils package.
type baseDBError struct {
	Message       string
	OriginalError *pq.Error
}

// Error implements the error interface for ErrDuplicateConstraint.
func (e errDupConstraint) Error() string {
	return fmt.Sprintf("dbErr: duplicate key value violates unique constraint: %s, table: %s, detail: %s",
		e.OriginalError.Constraint, e.OriginalError.Table, e.OriginalError.Detail)
}

// Error implements the error interface for baseDBError. In most cases, this should be handled for each specific type that embeds it
func (e baseDBError) Error() string {
	return fmt.Sprintf("dbErr: message: %s, error %v", e.Message, e.OriginalError)
}

// Unwrap returns the original pq error.
func (e *baseDBError) Unwrap() error {
	return e.OriginalError
}

func ProcessDataBaseErrors(message string, err error) error {
	if pqErr, ok := err.(*pq.Error); ok {

		switch pqErr.Code.Name() {
		case "unique_violation":
			return newErrDupConstraintErr(message, pqErr)

		default:
			return newBaseDBError(message, pqErr)
		}

	}
	return fmt.Errorf(message+" err: %w", err)

}
