package models

import (
	"time"

	"github.com/guregu/null"
)

// AccessibilityRequestMetrics models metrics about accessibility requests
type AccessibilityRequestMetrics struct {
	StartTime               time.Time `json:"start_time"`
	EndTime                 time.Time `json:"end_time"`
	CreatedAndOpen          int       `json:"created_and_open"`
	CreatedAndClosed        int       `json:"created_and_closed"`
	CreatedAndInRemediation int       `json:"created_and_in_remediation"`
}

// AccessibilityMetricsLine models a row of the 508 metrics csv
type AccessibilityMetricsLine struct {
	Name                       string
	LCID                       string
	Status                     AccessibilityRequestStatus
	CreatedAt                  time.Time `db:"created_at"`
	StatusCreatedAt            time.Time `db:"status_created_at"`
	InitialTestDate            null.Time `db:"initial_test_date"`
	InitialTestScore           null.Int  `db:"initial_test_score"`
	EarliestPassingTestDate    null.Time `db:"earliest_passing_test_date"`
	MostRecentRemediationScore null.Int  `db:"most_recent_remediation_score"`
	TestCount                  int       `db:"test_count"`
	FailedTestCount            int       `db:"failed_test_count"`
}
