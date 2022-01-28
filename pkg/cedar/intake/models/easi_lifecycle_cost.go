package models

// EASILifecycleCost represents a lifecycle cost item
type EASILifecycleCost struct {

	// business case Id
	// Required: true
	BusinessCaseID *string `json:"businessCaseId"`

	// cost
	// Required: true
	Cost *string `json:"cost"`

	// id
	// Required: true
	ID *string `json:"id"`

	// phase
	// Required: true
	Phase *string `json:"phase"`

	// solution
	// Required: true
	Solution *string `json:"solution"`

	// year
	// Required: true
	Year *string `json:"year"`
}
