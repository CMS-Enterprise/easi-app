package models

import (
	"fmt"
	"io"
	"log"
	"strconv"
	"time"

	"github.com/google/uuid"
)

// AccessibilityRequestStatus is a constant defining possible statuses of an accessibility request
type AccessibilityRequestStatus string

const (
	// AccessibilityRequestStatusOpen is the status when a request is open
	AccessibilityRequestStatusOpen AccessibilityRequestStatus = "OPEN"
	// AccessibilityRequestStatusInRemediation is the status when a request is in remediation
	AccessibilityRequestStatusInRemediation AccessibilityRequestStatus = "IN_REMEDIATION"
	// AccessibilityRequestStatusClosed is the status of a request that has been closed
	AccessibilityRequestStatusClosed AccessibilityRequestStatus = "CLOSED"
)

// IsValid returns if the status is valid
func (s AccessibilityRequestStatus) IsValid() bool {
	switch s {
	case AccessibilityRequestStatusOpen, AccessibilityRequestStatusInRemediation, AccessibilityRequestStatusClosed:
		return true
	}
	return false
}

func (s AccessibilityRequestStatus) String() string {
	return string(s)
}

// UnmarshalGQL unmarshals a value for GraphQL
func (s *AccessibilityRequestStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*s = AccessibilityRequestStatus(str)
	if !s.IsValid() {
		return fmt.Errorf("%s is not a valid AccessibilityRequestStatusRecord", str)
	}
	return nil
}

// MarshalGQL marshals a value for GraphQL
func (s AccessibilityRequestStatus) MarshalGQL(w io.Writer) {
	_, err := fmt.Fprint(w, strconv.Quote(s.String()))
	if err != nil {
		log.Fatalf("unable to marshall accessibility request status: %s", err) // TODO: don't think this should be fatal, but don't know how to log it otherwise
	}
}

// AccessibilityRequestStatusRecord represents data about a status that has been set
type AccessibilityRequestStatusRecord struct {
	ID        uuid.UUID                  `json:"id"`
	Status    AccessibilityRequestStatus `json:"status" db:"status"`
	RequestID uuid.UUID                  `json:"requestId" db:"request_id"`
	CreatedAt *time.Time                 `json:"createdAt" db:"created_at"`
}
