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
	TestType  TestDateTestType `json:"testType"`
	Date      time.Time        `json:"date"`
	Score     *int             `json:"score"`
	CreatedAt *time.Time
	UpdatedAt *time.Time
}
