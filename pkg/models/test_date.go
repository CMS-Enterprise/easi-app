package models

import (
	"time"

	"github.com/google/uuid"
)

// TestDateTestType represents the test type of a 508 test instance
type TestDateTestType string

const (
	// TestDateTestTypeInitial captures enum value INITIAL
	TestDateTestTypeInitial TestDateTestType = "INITIAL"
	// TestDateTestTypeRemediation captures enum value REMEDIATION
	TestDateTestTypeRemediation TestDateTestType = "REMEDIATION"
)

// TestDate models a 508 test date
type TestDate struct {
	ID        uuid.UUID        `json:"id"`
	RequestID uuid.UUID        `db:"request_id"`
	TestType  TestDateTestType `db:"test_type"`
	Date      time.Time
	Score     *int
	CreatedAt *time.Time `db:"created_at"`
	UpdatedAt *time.Time `db:"updated_at"`
	DeletedAt *time.Time `db:"deleted_at"`
}
