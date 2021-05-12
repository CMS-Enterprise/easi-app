package models

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

// PreSignedURL is the model to return S3 pre-signed URLs
type PreSignedURL struct {
	URL      string `json:"URL"`
	Filename string `json:"filename"`
}

// AccessibilityRequestDocumentStatus represents the availability of a document
type AccessibilityRequestDocumentStatus string

// AccessibilityRequestDocumentCommonType represents the type of document
type AccessibilityRequestDocumentCommonType string

const (
	// AccessibilityRequestDocumentStatusAvailable means that the document passed security screen
	AccessibilityRequestDocumentStatusAvailable AccessibilityRequestDocumentStatus = "AVAILABLE"
	// AccessibilityRequestDocumentStatusPending means that the document was just uploaded
	AccessibilityRequestDocumentStatusPending AccessibilityRequestDocumentStatus = "PENDING"
	// AccessibilityRequestDocumentStatusUnavailable means that the document failed security screen
	AccessibilityRequestDocumentStatusUnavailable AccessibilityRequestDocumentStatus = "UNAVAILABLE"

	// AccessibilityRequestDocumentCommonTypeAwardedVpat means the document is an Awarded VPAT
	AccessibilityRequestDocumentCommonTypeAwardedVpat AccessibilityRequestDocumentCommonType = "AWARDED_VPAT"
	// AccessibilityRequestDocumentCommonTypeOther means the document is another type
	AccessibilityRequestDocumentCommonTypeOther AccessibilityRequestDocumentCommonType = "OTHER"
	// AccessibilityRequestDocumentCommonTypeRemediationPlan means the document is a remediationPlan
	AccessibilityRequestDocumentCommonTypeRemediationPlan AccessibilityRequestDocumentCommonType = "REMEDIATION_PLAN"
	// AccessibilityRequestDocumentCommonTypeTestingVpat means the document is a testing VPAT
	AccessibilityRequestDocumentCommonTypeTestingVpat AccessibilityRequestDocumentCommonType = "TESTING_VPAT"
	// AccessibilityRequestDocumentCommonTypeTestPlan means the document is a test plan
	AccessibilityRequestDocumentCommonTypeTestPlan AccessibilityRequestDocumentCommonType = "TEST_PLAN"
	// AccessibilityRequestDocumentCommonTypeTestResults means the document is test results
	AccessibilityRequestDocumentCommonTypeTestResults AccessibilityRequestDocumentCommonType = "TEST_RESULTS"
)

// IsValid returns if the status is valid
func (e AccessibilityRequestDocumentStatus) IsValid() bool {
	switch e {
	case AccessibilityRequestDocumentStatusAvailable, AccessibilityRequestDocumentStatusPending, AccessibilityRequestDocumentStatusUnavailable:
		return true
	}
	return false
}

func (e AccessibilityRequestDocumentStatus) String() string {
	return string(e)
}

// UnmarshalGQL unmarshals a value for GraphQL
func (e *AccessibilityRequestDocumentStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = AccessibilityRequestDocumentStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid AccessibilityRequestDocumentStatus", str)
	}
	return nil
}

// MarshalGQL marshals a value for GraphQL
func (e AccessibilityRequestDocumentStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

// AccessibilityRequestDocument is the representation of stored files uploaded to S3
type AccessibilityRequestDocument struct {
	ID                 uuid.UUID                              `json:"id"`
	FileType           string                                 `json:"fileType" db:"file_type"`
	Bucket             string                                 `json:"bucket" db:"bucket"`
	Key                string                                 `json:"fileKey" db:"file_key"`
	Name               string                                 `json:"name" db:"file_name"`
	Size               int                                    `json:"size" db:"file_size"`
	URL                string                                 `json:"url"`
	Status             AccessibilityRequestDocumentStatus     `json:"status"`
	VirusScanned       null.Bool                              `json:"virusScanned" db:"virus_scanned"`
	VirusClean         null.Bool                              `json:"virusClean" db:"virus_clean"`
	RequestID          uuid.UUID                              `json:"requestId" db:"request_id"`
	CommonDocumentType AccessibilityRequestDocumentCommonType `db:"document_type"`
	OtherType          string                                 `db:"other_type"`
	CreatedAt          *time.Time                             `json:"createdAt" db:"created_at"`
	UpdatedAt          *time.Time                             `json:"updatedAt" db:"updated_at"`
	DeletedAt          *time.Time                             `json:"deletedAt" db:"deleted_at"`
}
